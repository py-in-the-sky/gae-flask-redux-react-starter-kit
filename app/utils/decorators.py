from functools import update_wrapper


def decorate(*decorators):
    """
    Before:

    @app.route('/')
    @jsonify
    @validate_form(MyForm)
    def index(my_form):
        return 'hi'

    You don't have access to the original, base `index` function.  In Python 3,
    functools' `update_wrapper` takes care of this by adding a `__wrapped__`
    field to the wrappers, but `__wrapped__` is unfortunately not provided in
    Python 2.


    After:

    @decorate(
        app.route('/'),
        jsonify,
        validate_form(MyForm))
    def index(my_form):
        return 'hi'

    Now we can easily test the original, base `index` function by retrieving it
    via `index.__wrapped__`: `assert index.__wrapped__() == 'hi'`.
    """

    def decorator(function):
        _function = compose(*decorators)(function)
        update_wrapper(_function, function)
        _function.__wrapped__ = function
        return _function

    return decorator


def compose(*functions):
    "e.g., compose(f1, f2, f3)(x) == f1(f2(f3(x)))"
    return lambda arg: \
        reduce(lambda composed, f: f(composed), reversed(functions), arg)
