from flask.ext.restful import \
    Resource, fields, marshal_with, reqparse, abort
import random
from app import models
from app.utils.werkzeug_debugger import werkzeug_debugger


request_parser = reqparse.RequestParser(
    trim=True,
    bundle_errors=True,
    namespace_class=dict
)
request_parser.add_argument(
    'name',
    type=str,
    # location='json',
    required=True,
    help='"name" must be a string'
)


response_body_schema = {
    'name': fields.String
}


class Name(Resource):
    decorators=[ marshal_with(response_body_schema) ]

    def get(self):
        "return random Name"
        # a = 4
        # werkzeug_debugger()
        limit = 10
        name_keys = models.Name.query().fetch(limit, keys_only=True)
        random_name = random.choice(name_keys).get()
        return random_name


    def post(self):
        "create and return name"
        # abort(400, message='hi')
        # TODO: https://cloud.google.com/appengine/docs/python/ndb/modelclass#Model_get_or_insert
        kwargs = request_parser.parse_args(strict=True)
        name = models.Name(**kwargs)
        name.put()
        return name
