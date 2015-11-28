from flask import Blueprint
from utils.jsonify import jsonify
# from utils.werkzeug_debugger import werkzeug_debugger


api = Blueprint('api', __name__)


@api.route('/name/')
@jsonify
def get_name():
    return { 'name': 'World' }


@api.route('/name/', methods=['POST'])
@jsonify
def post_name():
    # TODO: Flask-WTF
    pass


@api.route('/')
@jsonify
def hello():
    """Return a friendly HTTP greeting."""
    # werkzeug_debugger()
    return { 'message': 'Hello World!' }


@api.route('/array')
@jsonify
def array():
    return [ 'hello', 'world' ]


@api.route('/<path:path>')
@jsonify
def api_catch_all(path):
    message = 'You asked for an API path: %s' % path
    return { 'message': message }
