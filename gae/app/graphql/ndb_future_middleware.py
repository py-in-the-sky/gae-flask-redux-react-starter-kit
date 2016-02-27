"""
https://github.com/graphql-python/graphql-core/issues/14
"""


from google.appengine.ext.ndb import Future
from graphql.core.pyutils.defer import Deferred


def process_future_result(deferred, future):
    def handle_future_result():
        exception = future.get_exception()
        if exception:
            deferred.errback(exception)

        else:
            deferred.callback(future.get_result())

    return handle_future_result


class NdbFutureMiddleware(object):
    @staticmethod
    def run_resolve_fn(resolver, _):
        result = resolver()
        if isinstance(result, Future):
            d = Deferred()
            result.add_immediate_callback(process_future_result(d, result))
            return d

        return result

    @staticmethod
    def execution_result(executor):
        future = Future()
        result = executor()
        assert isinstance(result, Deferred), 'Another middleware has converted the execution result ' \
                                             'away from a Deferred.'

        result.add_callbacks(future.set_result, future.set_exception)
        return future
