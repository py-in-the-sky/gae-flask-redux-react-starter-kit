from flask import Blueprint


api_blueprint = Blueprint('api', __name__)


from .v1 import api
