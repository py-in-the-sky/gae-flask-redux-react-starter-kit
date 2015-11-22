"""`main` is the top level module for your Flask application."""


from flask import Flask
from werkzeug.debug import DebuggedApplication
main = Flask(__name__)


@main.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    # assert False  # init Werkzeug debugger
    return 'Hello World!'


@main.route('/api/')
@main.route('/api/<path:path>')
def api_catch_all(path=''):
    return 'You asked for an API path: %s' % path


@main.route('/<path:path>')
def catch_all(path):
    return 'You want path: %s' % path


@main.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@main.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500


main.debug = True
app = DebuggedApplication(main, evalex=True)
# In order for debug to work with GAE, use DebuggedApplication.
# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.
