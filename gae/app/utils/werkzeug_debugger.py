"""
adapted from: http://flask.pocoo.org/snippets/21/
"""


from flask import current_app


def werkzeug_debugger():
    """
    Call this where you'd like to force the Werkzeug debugger to open.
    Assertion error will only be thrown when the app is in debug mode,
    protecting you if you accidentally leave a `werkzeug_debugger()`
    call inline when deploying.
    """
    assert current_app.debug is not True, 'werkzeug_debugger()'
