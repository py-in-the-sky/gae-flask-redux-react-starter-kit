from flask.ext.restful import \
    Resource, fields, marshal_with, reqparse, abort
from datetime import datetime
from models import name
# from utils.werkzeug_debugger import werkzeug_debugger


parser = reqparse.RequestParser(trim=True, bundle_errors=True)
parser.add_argument(
    'name',
    type=str,
    # location='json',
    required=True,
    help='"name" must be a string'
)


name_fields = {
    'name': fields.String,
    'now':  fields.DateTime
}


class Name(Resource):
    decorators=[marshal_with(name_fields)]

    def get(self):
        # a = 4
        # werkzeug_debugger()
        return {
            'name': 'World',
            'foo': 'bar',
            'now': datetime.now()
        }

    def post(self):
        # abort(400, message='hi')
        args = parser.parse_args()
        return {
            'name': args.name,
            'foo': 'bar',
            'now': datetime.now()
        }
