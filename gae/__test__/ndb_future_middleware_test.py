from collections import namedtuple

from google.appengine.ext import ndb
from graphql.core.error import format_error
from graphql.core.execution import Executor
from graphql.core import type
import graphene

from app.graphql.ndb_future_middleware import NdbFutureMiddleware


def test_ndb_future_executor():
    query = 'query Example { a b }'

    @ndb.tasklet
    def resolver(*_):
        future = ndb.Future()
        future.set_result('hey')
        return_value = yield future
        raise ndb.Return(return_value)

    def resolver_2(*_):
        return 'hey2'

    Type = type.GraphQLObjectType('Type', {
        'a': type.GraphQLField(type.GraphQLString, resolver=resolver),
        'b': type.GraphQLField(type.GraphQLString, resolver=resolver_2)
    })

    executor = Executor([NdbFutureMiddleware()])
    result = executor.execute(type.GraphQLSchema(Type), query).get_result()
    assert not result.errors
    assert result.data == {'a': 'hey', 'b': 'hey2'}


def test_ndb_future_graphene():
    query = 'query Example { a b }'

    class Query(graphene.ObjectType):
        a = graphene.String()
        b = graphene.String()

        @ndb.tasklet
        def resolve_a(self, *_):
            future = ndb.Future()
            future.set_result('hey')
            return_value = yield future
            raise ndb.Return(return_value)

        def resolve_b(self, *_):
            return 'hey2'

    executor = Executor([NdbFutureMiddleware()])
    schema = graphene.Schema(query=Query, executor=executor)
    result = schema.execute(query).get_result()
    assert not result.errors
    assert result.data == {'a': 'hey', 'b': 'hey2'}


def test_ndb_future_executor_nested():
    """
    This test illustrates that nested NDB futures are handled correctly.
    """
    query = 'query Nested { a { b c } }'

    @ndb.tasklet
    def resolver_a(*_):
        ATuple = namedtuple('ATuple', 'c')
        future = ndb.Future()
        future.set_result(ATuple('yo'))
        return_value = yield future
        raise ndb.Return(return_value)

    @ndb.tasklet
    def resolver_b(*_):
        future = ndb.Future()
        future.set_result('hi')
        return_value = yield future
        raise ndb.Return(return_value)

    A = type.GraphQLObjectType('A',{
        'b': type.GraphQLField(type.GraphQLString, resolver=resolver_b),
        'c': type.GraphQLField(type.GraphQLString)
    })

    Type = type.GraphQLObjectType('Type', {
        'a': type.GraphQLField(A, resolver=resolver_a)
    })

    executor = Executor([NdbFutureMiddleware()])
    result = executor.execute(type.GraphQLSchema(Type), query).get_result()
    assert not result.errors
    assert result.data == {'a': {'b': 'hi', 'c': 'yo'}}


def test_ndb_future_executor_concurrency(testbed):
    """
    This test illustrates how disjoint parts of the query tree can run concurrently.
    The setup for the test makes it impossible for any tasklet to return if they are
    run sequentially.
    """
    query = 'query Concurrent { a { b c } d }'

    class Lock(ndb.Model):
        locked = ndb.BooleanProperty()

    lock_b_key = Lock(locked=True, id='b').put()
    lock_c_key = Lock(locked=True, id='c').put()
    lock_d_key = Lock(locked=True, id='d').put()

    @ndb.tasklet
    def resolver_a(*_):
        future = ndb.Future()
        future.set_result({})
        return_value = yield future
        raise ndb.Return(return_value)

    @ndb.tasklet
    def resolver_b(*_):
        while True:
            lock_b = yield lock_b_key.get_async()
            if not lock_b.locked:
                break

        lock_c = yield lock_c_key.get_async()
        lock_c.locked = False
        lock_c.put_async()

        raise ndb.Return(str(lock_b.locked))

    @ndb.tasklet
    def resolver_c(*_):
        lock_d = yield lock_d_key.get_async()
        lock_d.locked = False
        lock_d.put_async()

        while True:
            lock_c = yield lock_c_key.get_async()
            if not lock_c.locked:
                break

        raise ndb.Return(str(lock_c.locked))

    @ndb.tasklet
    def resolver_d(*_):
        while True:
            lock_d = yield lock_d_key.get_async()
            if not lock_d.locked:
                break

        lock_b = yield lock_b_key.get_async()
        lock_b.locked = False
        lock_b.put_async()

        raise ndb.Return(str(lock_d.locked))

    A = type.GraphQLObjectType('A',{
        'b': type.GraphQLField(type.GraphQLString, resolver=resolver_b),
        'c': type.GraphQLField(type.GraphQLString, resolver=resolver_c)
    })

    Type = type.GraphQLObjectType('Type', {
        'a': type.GraphQLField(A, resolver=resolver_a),
        'd': type.GraphQLField(type.GraphQLString, resolver=resolver_d)
    })

    assert lock_b_key.get().locked == lock_c_key.get().locked == lock_d_key.get().locked == True
    result = Executor([NdbFutureMiddleware()]).execute(type.GraphQLSchema(Type), query).get_result()
    assert lock_b_key.get().locked == lock_c_key.get().locked == lock_d_key.get().locked == False
    assert not result.errors
    assert result.data == {'a': {'b': 'False', 'c': 'False'}, 'd': 'False'}


def test_ndb_future_graphene_nested_and_concurrent(testbed):
    query = '''
        query Concurrent {
            a {
                id
                locks {
                    id
                    locked
                }
            }
            d {
                id
                locked
            }
        }
    '''

    class Lock(ndb.Model):
        locked = ndb.BooleanProperty()

    class LockParent(ndb.Model):
        locks = ndb.KeyProperty(repeated=True)

    lock_b_key = Lock(locked=True, id='b').put()
    lock_c_key = Lock(locked=True, id='c').put()
    lock_d_key = Lock(locked=True, id='d').put()
    lock_parent_key = LockParent(locks=[lock_b_key, lock_c_key], id='a').put()

    class TypeB(graphene.ObjectType):
        id = graphene.ID()
        locked = graphene.Boolean()

    class TypeA(graphene.ObjectType):
        id = graphene.ID()
        locks = graphene.List(TypeB)

        @ndb.tasklet
        def resolve_locks(self, *_):
            lock_parent = yield LockParent.get_by_id_async(self.id)

            while True:
                locks = yield ndb.get_multi_async(lock_parent.locks)
                if all(not l.locked for l in locks):
                    break

            lock_d = yield lock_d_key.get_async()
            lock_d.locked = False
            lock_d.put_async()

            raise ndb.Return([TypeB(id=l.key.id(), locked=l.locked) for l in locks])

    class Query(graphene.ObjectType):
        a = graphene.Field(TypeA)
        d = graphene.Field(TypeB)

        @ndb.tasklet
        def resolve_a(self, *_):
            a = yield lock_parent_key.get_async()
            raise ndb.Return(TypeA(id=a.key.id()))

        @ndb.tasklet
        def resolve_d(self, *_):
            lock_b, lock_c = yield lock_b_key.get_async(), lock_c_key.get_async()
            lock_b.locked, lock_c.locked = False, False
            lock_b.put_async()
            lock_c.put_async()

            while True:
                lock_d = yield lock_d_key.get_async()
                if not lock_d.locked:
                    break

            raise ndb.Return(TypeB(id=lock_d.key.id(), locked=lock_d.locked))

    assert lock_b_key.get().locked == lock_c_key.get().locked == lock_d_key.get().locked == True
    executor = Executor([NdbFutureMiddleware()])
    schema = graphene.Schema(query=Query, executor=executor)
    result = schema.execute(query).get_result()
    assert lock_b_key.get().locked == lock_c_key.get().locked == lock_d_key.get().locked == False
    assert not result.errors
    assert result.data == {
        'a': {
            'id': 'a',
            'locks': [
                {
                    'id': 'b',
                    'locked': False
                },
                {
                    'id': 'c',
                    'locked': False
                }
            ]
        },
        'd': {
            'id': 'd',
            'locked': False
        }
    }


@ndb.toplevel
def test_ndb_future_executor_concurrency_top_level(testbed):
    """
    This test illustrates a full query is an async process that can run concurrently
    with other async processes that may occur in a request-response cycle.
    """
    query = 'query Concurrent { a }'

    class Lock(ndb.Model):
        locked = ndb.BooleanProperty()

    lock_a_key = Lock(locked=True, id='a').put()
    lock_b_key = Lock(locked=True, id='b').put()

    @ndb.tasklet
    def resolver(*_):
        lock_b = yield lock_b_key.get_async()
        lock_b.locked = False
        lock_b.put_async()

        while True:
            lock_a = yield lock_a_key.get_async()
            if not lock_a.locked:
                break

        raise ndb.Return(str(lock_a.locked))

    @ndb.tasklet
    def other_process():
        lock_a = yield lock_a_key.get_async()
        lock_a.locked = False
        lock_a.put_async()

        while True:
            lock_b = yield lock_b_key.get_async()
            if not lock_b.locked:
                break

        raise ndb.Return(str(lock_b.locked))

    Type = type.GraphQLObjectType('Type', {
        'a': type.GraphQLField(type.GraphQLString, resolver=resolver)
    })

    assert lock_a_key.get().locked == lock_b_key.get().locked == True
    query_future = Executor([NdbFutureMiddleware()]).execute(type.GraphQLSchema(Type), query)
    other_process()
    assert isinstance(query_future, ndb.Future)
    result = query_future.get_result()
    assert lock_a_key.get().locked == lock_b_key.get().locked == False
    assert not result.errors
    assert result.data == {'a': 'False'}


@ndb.toplevel
def test_ndb_future_graphene_concurrency_top_level(testbed):
    query = 'query Concurrent { a }'

    class Lock(ndb.Model):
        locked = ndb.BooleanProperty()

    lock_a_key = Lock(locked=True, id='a').put()
    lock_b_key = Lock(locked=True, id='b').put()

    class Query(graphene.ObjectType):
        a = graphene.String()

        @ndb.tasklet
        def resolve_a(self, *_):
            lock_b = yield lock_b_key.get_async()
            lock_b.locked = False
            lock_b.put_async()

            while True:
                lock_a = yield lock_a_key.get_async()
                if not lock_a.locked:
                    break

            raise ndb.Return(str(lock_a.locked))

    @ndb.tasklet
    def other_process():
        lock_a = yield lock_a_key.get_async()
        lock_a.locked = False
        lock_a.put_async()

        while True:
            lock_b = yield lock_b_key.get_async()
            if not lock_b.locked:
                break

        raise ndb.Return(str(lock_b.locked))

    assert lock_a_key.get().locked == lock_b_key.get().locked == True
    executor = Executor([NdbFutureMiddleware()])
    schema = graphene.Schema(query=Query, executor=executor)
    query_future = schema.execute(query)
    other_process()
    assert isinstance(query_future, ndb.Future)
    result = query_future.get_result()
    assert lock_a_key.get().locked == lock_b_key.get().locked == False
    assert not result.errors
    assert result.data == {'a': 'False'}


def test_ndb_future_executor_with_error():
    query = 'query Example { a b }'

    @ndb.tasklet
    def resolver(*_):
        future = ndb.Future()
        future.set_result('hey')
        return_value = yield future
        raise ndb.Return(return_value)

    @ndb.tasklet
    def resolver_2(*_):
        future = ndb.Future()
        future.set_result('hey2')
        return_value = yield future

        raise Exception('Exception inside NDB tasklet')

        raise ndb.Return(return_value)

    Type = type.GraphQLObjectType('Type', {
        'a': type.GraphQLField(type.GraphQLString, resolver=resolver),
        'b': type.GraphQLField(type.GraphQLString, resolver=resolver_2)
    })

    executor = Executor([NdbFutureMiddleware()])
    result = executor.execute(type.GraphQLSchema(Type), query).get_result()
    formatted_errors = list(map(format_error, result.errors))
    assert formatted_errors == [{
        'locations': [{'column': 19, 'line': 1}],
        'message': 'Exception inside NDB tasklet'
    }]
    assert result.data == {'a': 'hey', 'b': None}


def test_ndb_future_graphene_with_error():
    query = 'query Example { a b }'

    class Query(graphene.ObjectType):
        a = graphene.String()
        b = graphene.String()

        @ndb.tasklet
        def resolve_a(self, *_):
            future = ndb.Future()
            future.set_result('hey')
            return_value = yield future
            raise ndb.Return(return_value)

        @ndb.tasklet
        def resolve_b(self, *_):
            future = ndb.Future()
            future.set_result('hey2')
            return_value = yield future

            raise Exception('Exception inside NDB tasklet')

            raise ndb.Return(return_value)

    executor = Executor([NdbFutureMiddleware()])
    schema = graphene.Schema(query=Query, executor=executor)
    result = schema.execute(query).get_result()
    formatted_errors = list(map(format_error, result.errors))
    assert formatted_errors == [{
        'locations': [{'column': 19, 'line': 1}],
        'message': 'Exception inside NDB tasklet'
    }]
    assert result.data == {'a': 'hey', 'b': None}
