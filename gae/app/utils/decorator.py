"""
Adapted from Peter Norvig's Design of Computer Programs
(https://www.udacity.com/course/design-of-computer-programs--cs212)

Example use of `decorator`

    from utils.decorator import decorator as d

    @d(app.route('/'))
    @jsonify
    @validate_form(MyForm)
    def index(my_form):
        return 'hi'

Where `app.route` is defined outside the project (and therefore needs to be
wrapped with standard function notation `d(...)` instead of decorator notation)
and `jsonify` and `validate_form` are defined in the project -- e.g.:

    @decorator
    def jsonify(f):
        ...
"""


from functools import update_wrapper


def _decorator(d):
    "make function `d` a decorator: `d` wraps function `f` and takes on metadata"
    def decorator(f):
        _f = d(f)  # what `d` was designed to do
        update_wrapper(_f, f)
        _f.__wrapped__ = f.func_dict.get('__wrapped__', f)
        # the above line ensures base function is passed up entire chain of
        # decorators for easy retrieval for testing
        return _f

    return decorator


# apply `_decorator` to itself so that it behaves like a proper decorator,
# updating metadata and setting `__wrapped__` on the wrapper it returns
decorator = _decorator(_decorator)
