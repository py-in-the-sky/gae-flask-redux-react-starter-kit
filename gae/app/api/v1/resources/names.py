from flask.ext.restful import \
    Resource, fields, marshal_with, reqparse
from google.appengine.ext import ndb
from app.models import name
from app.utils.reqparse import string_length
from app.utils.func import compose
from app.utils.werkzeug_debugger import werkzeug_debugger


name_validation = compose(
    name.Name.ensure_name_not_in_datastore,
    string_length(min_len=1, max_len=10)
)


request_parser = reqparse.RequestParser(
    trim=True,
    bundle_errors=True,
    namespace_class=dict
)
request_parser.add_argument(
    'name',
    type=name_validation,
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
        random_name = name.Name.random_key().get()
        return random_name

    @ndb.transactional
    def post(self):
        "create and return name; maintain no more than 11 names in datastore"
        kwargs = request_parser.parse_args()
        name_key = name.Name(parent=name.root, **kwargs).put()
        new_name = name_key.get()

        if name.Name.query(ancestor=name.root).count() > 10:
            name.Name.random_key(excluding=name_key).delete()

        return new_name
