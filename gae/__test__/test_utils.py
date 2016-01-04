from app.utils import func, reqparse, decorator, werkzeug_debugger
import pytest


def test_func_compose():
    a = lambda x: x ** 3
    b = lambda x: x * -4
    c = lambda x: x + 5
    assert func.compose(a, b, c)(5) == a(b(c(5)))

    x = lambda s: ''.join(reversed(s))[-2:]
    y = lambda s: s + 'abc'
    z = lambda s: s * 3
    assert func.compose(x, y, z)('abc') == x(y(z('abc')))


def test_reqparse_string_length():
    no_validation = reqparse.string_length()
    no_validation('')
    no_validation('a' * 25)

    yes_validation = reqparse.string_length(min_len=1, max_len=10)

    with pytest.raises(ValueError) as excinfo:
        yes_validation('')

    assert 'must be at least 1 character long' == str(excinfo.value)

    with pytest.raises(ValueError) as excinfo:
        yes_validation('a' * 11)

    assert 'must be no more than 10 characters long' == str(excinfo.value)


def test_decorator():
    @decorator.decorator
    def a(f):
        "a's doc string"
        def _f():
            return 'a' + f()

        return _f

    @decorator.decorator
    def b(f):
        def _f():
            return 'b' + f()

        return _f

    @a
    @b
    def c():
        "c's doc string"
        return 'c'

    unwrapped_a = a.func_dict['__wrapped__']
    assert a.func_name == unwrapped_a.func_name == 'a'
    assert a.func_doc == unwrapped_a.func_doc == "a's doc string"

    unwrapped_c = c.func_dict['__wrapped__']
    assert c() == 'abc'
    assert unwrapped_c() == 'c'
    assert c.func_name == unwrapped_c.func_name == 'c'
    assert c.func_doc == unwrapped_c.func_doc == "c's doc string"


def test_werkzeug_debugger():
    from flask import Flask
    app = Flask(__name__)

    with app.app_context():
        werkzeug_debugger.werkzeug_debugger()

    app.debug = True

    with app.app_context():
        with pytest.raises(AssertionError) as excinfo:
            werkzeug_debugger.werkzeug_debugger()

    assert 'werkzeug_debugger()' == str(excinfo.value)
