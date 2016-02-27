from google.appengine.ext import ndb
from graphql.core.error import format_error
from graphql.core.execution import Executor
from graphql.core.type import (
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLField,
    GraphQLString
)
from app.graphql.ndb_future_middleware import NdbFutureMiddleware
from collections import namedtuple


def test_ndb_future_executor():
    query = 'query Example { a, b }'

    @ndb.tasklet
    def resolver(*_):
        future = ndb.Future()
        future.set_result('hey')
        return_value = yield future
        raise ndb.Return(return_value)

    def resolver_2(*_):
        return 'hey2'

    Type = GraphQLObjectType('Type', {
        'a': GraphQLField(GraphQLString, resolver=resolver),
        'b': GraphQLField(GraphQLString, resolver=resolver_2)
    })

    executor = Executor([NdbFutureMiddleware()])
    result = executor.execute(GraphQLSchema(Type), query).get_result()
    assert not result.errors
    assert result.data == {'a': 'hey', 'b': 'hey2'}


def test_ndb_future_executor_nested():
    """
    This test illustrates that nested NDB futures are handled correctly.
    """
    query = 'query Nested { a { b, c } }'

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

    A = GraphQLObjectType('A',{
        'b': GraphQLField(GraphQLString, resolver=resolver_b),
        'c': GraphQLField(GraphQLString)
    })

    Type = GraphQLObjectType('Type', {
        'a': GraphQLField(A, resolver=resolver_a)
    })

    executor = Executor([NdbFutureMiddleware()])
    result = executor.execute(GraphQLSchema(Type), query).get_result()
    assert not result.errors
    assert result.data == {'a': {'b': 'hi', 'c': 'yo'}}


def test_ndb_future_executor_concurrency(testbed):
    """
    This test illustrates how disjoint parts of the query tree can run concurrently.
    The setup for the test makes it impossible for any tasklet to return if they are
    run sequentially.
    """
    query = 'query Concurrent { a { b, c }, d }'

    class Lock(ndb.Model):
        locked = ndb.BooleanProperty()

    lock_b_key = Lock(locked=True).put()
    lock_c_key = Lock(locked=True).put()
    lock_d_key = Lock(locked=True).put()

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

    A = GraphQLObjectType('A',{
        'b': GraphQLField(GraphQLString, resolver=resolver_b),
        'c': GraphQLField(GraphQLString, resolver=resolver_c)
    })

    Type = GraphQLObjectType('Type', {
        'a': GraphQLField(A, resolver=resolver_a),
        'd': GraphQLField(GraphQLString, resolver=resolver_d)
    })

    assert lock_b_key.get().locked == lock_c_key.get().locked == lock_d_key.get().locked == True
    result = Executor([NdbFutureMiddleware()]).execute(GraphQLSchema(Type), query).get_result()
    assert lock_b_key.get().locked == lock_c_key.get().locked == lock_d_key.get().locked == False
    assert not result.errors
    assert result.data == {'a': {'b': 'False', 'c': 'False'}, 'd': 'False'}


@ndb.toplevel
def test_ndb_future_executor_concurrency_top_level(testbed):
    """
    This test illustrates a full query is an async process that can run concurrently
    with other async processes that may occur in a request-response cycle.
    """
    query = 'query Concurrent { a }'

    class Lock(ndb.Model):
        locked = ndb.BooleanProperty()

    lock_a_key = Lock(locked=True).put()
    lock_b_key = Lock(locked=True).put()

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

    Type = GraphQLObjectType('Type', {
        'a': GraphQLField(GraphQLString, resolver=resolver)
    })

    assert lock_a_key.get().locked == lock_b_key.get().locked == True
    query_future = Executor([NdbFutureMiddleware()]).execute(GraphQLSchema(Type), query)
    other_process()
    assert isinstance(query_future, ndb.Future)
    result = query_future.get_result()
    assert lock_a_key.get().locked == lock_b_key.get().locked == False
    assert not result.errors
    assert result.data == {'a': 'False'}


def test_ndb_future_executor_with_error():
    query = 'query Example { a, b }'

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

    Type = GraphQLObjectType('Type', {
        'a': GraphQLField(GraphQLString, resolver=resolver),
        'b': GraphQLField(GraphQLString, resolver=resolver_2)
    })

    executor = Executor([NdbFutureMiddleware()])
    result = executor.execute(GraphQLSchema(Type), query).get_result()
    formatted_errors = list(map(format_error, result.errors))
    assert formatted_errors == [{
        'locations': [{'column': 20, 'line': 1}],
        'message': 'Exception inside NDB tasklet'
    }]
    assert result.data == {'a': 'hey', 'b': None}
