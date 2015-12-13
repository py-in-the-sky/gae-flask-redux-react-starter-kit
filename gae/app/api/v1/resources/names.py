from flask.ext.restful import \
    Resource, fields, marshal_with, reqparse, abort
import random
from google.appengine.ext import ndb
from app.models import name
from app.utils.reqparse import string_with_length
from app.utils.func import compose
# from app.utils.werkzeug_debugger import werkzeug_debugger


name_type_validations = compose(
    name.Name.ensure_name_unique,
    string_with_length(min_len=1, max_len=10)
)


request_parser = reqparse.RequestParser(
    trim=True,
    bundle_errors=True,
    namespace_class=dict
)
request_parser.add_argument(
    'name',
    type=name_type_validations,
    # location='json',
    required=True
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
        name_keys = name.Name.query().fetch(limit, keys_only=True)
        random_name = random.choice(name_keys).get()
        return random_name

    @ndb.transactional
    def post(self):
        "create and return name"
        # TODO: make "name" the ID of the entity
        # TODO: see whether `fields` allows the `id` field to be mapped
        # to the `name` field in `response_body_schema`
        # TODO: clear datastore
        # TODO: ensure only 10 exist in datastore at any one time; when a
        # new name is created and there are alredy 10, delete the oldest
        # one and then create the new one
        kwargs = request_parser.parse_args()
        name_key = name.Name(parent=name.root, **kwargs).put()
        return name_key.get()
