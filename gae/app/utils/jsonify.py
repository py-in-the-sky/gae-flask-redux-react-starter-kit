from flask import jsonify as flask_jsonify
from decorator import decorator


# TODO/WIP: right now, handles just `dict` types for `response`,
# but will be expanded to handle the Flask `Response` object
# type as well as application models
# see:
# https://github.com/miguelgrinberg/oreilly-flask-apis-video/
#   blob/master/orders/app/decorators/json.py
# and: http://flask.pocoo.org/docs/0.10/patterns/viewdecorators/
@decorator
def jsonify(f):
    def _f(*args, **kwargs):
        response = f(*args, **kwargs)
        if isinstance(response, dict):
            return flask_jsonify(response)
        if isinstance(response, list):
            return flask_jsonify({ 'array': response })
        raise NotImplementedError()

    return _f


# TODO/WIP: implement the `to_dict` method on the `ApplicationModel`
# superclass
@decorator
def jsonify_models(f):
    def _f(*args, **kwargs):
        response = f(*args, **kwargs)
        return flask_jsonify({
            'array': [ model.to_dict() for model in response ]
        })

    return _f
