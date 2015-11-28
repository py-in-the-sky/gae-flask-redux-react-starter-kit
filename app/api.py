from flask import Blueprint
from utils.jsonify import jsonify
from flask.ext.restful import Api, Resource, fields, marshal_with, reqparse
from utils.werkzeug_debugger import werkzeug_debugger
from datetime import datetime


api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)


@api.representation('application/json')
def output_json(data, code, headers=None):
    from flask import jsonify
    response = jsonify(data)
    response.status_code = code
    response.headers.extend(headers or {})
    return response


parser = reqparse.RequestParser()
parser.add_argument(
    'name',
    type=str,
    location='json',
    required=True,
    help='"name" must be a string'
)


name_fields = {
    'name': fields.String,
    'now':  fields.DateTime
}


class Name(Resource):

    @marshal_with(name_fields)
    def get(self):
        return {
            'name': 'World',
            'foo': 'bar',
            'now': datetime.now()
        }

    @marshal_with(name_fields)
    def post(self):
        args = parser.parse_args()
        return {
            'name': args.name,
            'foo': 'bar',
            'now': datetime.now()
        }


api.add_resource(Name, '/names/')



@api_blueprint.route('/')
@jsonify
def hello():
    """Return a friendly HTTP greeting."""
    werkzeug_debugger()
    return { 'message': 'Hello World!' }


@api_blueprint.route('/array')
@jsonify
def array():
    return [ 'hello', 'world' ]


@api_blueprint.route('/<path:path>')
@jsonify
def api_catch_all(path):
    message = 'You asked for an API path: %s' % path
    return { 'message': message }
