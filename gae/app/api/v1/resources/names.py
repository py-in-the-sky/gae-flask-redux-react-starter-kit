from flask.ext.restful import \
    Resource, fields, marshal_with, reqparse, abort
from datetime import datetime
import random
from app import models
from app.utils.werkzeug_debugger import werkzeug_debugger


parser = reqparse.RequestParser(trim=True, bundle_errors=True)
parser.add_argument(
    'name',
    type=str,
    # location='json',
    required=True,
    help='"name" must be a string'
)


name_fields = {
    'name':     fields.String,
    'created':  fields.DateTime
}


class Name(Resource):
    decorators=[marshal_with(name_fields)]

    def get(self):
        "return random Name"
        # a = 4
        # werkzeug_debugger()
        name_keys = models.Name.query().fetch(keys_only=True)
        name = random.choice(name_keys).get()
        return {
            'name':    name.name,
            'foo':     'bar',
            'created': name.created
        }

    def post(self):
        # abort(400, message='hi')
        # TODO: https://cloud.google.com/appengine/docs/python/ndb/modelclass#Model_get_or_insert
        args = parser.parse_args()
        name = models.Name(name=args.name)
        name.put()
        return {
            'name':    name.name,
            'foo':     'bar',
            'created': name.created
        }
