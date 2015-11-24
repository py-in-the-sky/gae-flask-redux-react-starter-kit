from flask import Blueprint
api = Blueprint('api', __name__)


@api.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    # assert False  # init Werkzeug debugger
    return 'Hello World!'


@api.route('/<path:path>')
def api_catch_all(path):
    return 'You asked for an API path: %s' % path
