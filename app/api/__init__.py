"""
Advice on Flask-RESTful project structure:

This is a good file for registering all URL paths via `add_resource` and
for registering blueprint-level `before_request`, `after_request`, etc.

http://flask-restful-cn.readthedocs.org/en/0.3.4/intermediate-usage.html#project-structure
http://flask-restful-cn.readthedocs.org/en/0.3.4/api.html#flask_restful.Api.add_resource
"""


from flask import Blueprint, jsonify
from flask.ext.restful import Api
from resources.names import Name
from types import GeneratorType


api_blueprint = Blueprint('api', __name__)


api_errors = {
    'AssertionError': {
        'message': 'sorry, assertion error',
        'status': 400,
        'extra': 'extra'
    }
}


api = Api(api_blueprint, catch_all_404s=True, errors=api_errors)
# NB: the `errors` error handling doesn't happen when the Flask app
# is in debug mode.
# ACTION: make minimal app example and file Github issue.
# However, if we use the error handler below, it does work in debug mode.
# @api_blueprint.errorhandler(AssertionError)
# def not_implemented(_):
#     return jsonify({ 'sorry': 'assertion error' })


api.add_resource(Name, '/names/')


@api.representation('application/json')
def output_json(data, status_code, headers=None):
    if isinstance(data, list):
        data = { 'array': data }
    elif isinstance(data, GeneratorType):
        data = { 'array': list(data) }
    elif isinstance(data, (str, unicode)):
        data = { 'message': data }
    elif not isinstance(data, dict):
        raise NotImplementedError()

    response = jsonify(data)
    response.status_code = status_code
    response.headers.extend(headers or {})
    return response
