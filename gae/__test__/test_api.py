import pytest
import json
from flask import Flask
from app.api.v1 import output_json


def test_output_json():
    app = Flask(__name__)
    headers = { 'hi': 'there' }

    with pytest.raises(NotImplementedError):
        int_data = 1
        output_json(int_data, 200, headers)

    with app.app_context():
        with app.test_request_context('/'):
            dict_data = { 'a': 'b' }
            response = output_json(dict_data, 200, headers)

            assert json.loads(response.data) == dict_data
            assert response.status == '200 OK'
            assert response.headers.get('hi') == 'there'

            str_data = 'blah'
            response = output_json(str_data, 201)

            assert json.loads(response.data) == { 'message': str_data }
            assert response.status == '201 CREATED'

            list_data = ['a', 'b', 'c']
            response = output_json(list_data, 200)

            assert json.loads(response.data) == { 'array': list_data }

            tuple_data = ('a', 'b', 'c')
            response = output_json(tuple_data, 200)

            assert json.loads(response.data) == { 'array': ['a', 'b', 'c'] }

            generator_data = (char for char in 'abc')
            response = output_json(generator_data, 200)

            assert json.loads(response.data) == { 'array': ['a', 'b', 'c'] }
