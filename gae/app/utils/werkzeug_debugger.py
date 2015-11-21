"""
adapted from: http://flask.pocoo.org/snippets/21/
"""


from flask import current_app


def werkzeug_debugger():
    "call this where you'd like to force the Werkzeug debugger to open"
    assert current_app.debug is not True, 'werkzeug_debugger()'
