import pytest
import json
from app.models import name
from app import create_app
from config import config


@pytest.fixture(scope='function')
def app():
    return create_app(config['test'])


@pytest.fixture(scope='function')
def client(app):
    return app.test_client()


def test_warmup(client):
    response = client.get('/_ah/warmup')
    assert response.data == 'Warmed up!'
    assert response.status == '200 OK'


def test_get_name(client, testbed):
    name.Name(parent=name.root, name='c3po').put()
    response = client.get('/api/v1/names/')
    assert json.loads(response.data) == { 'name': 'c3po' }
    assert response.status == '200 OK'


def test_get_name_no_data(client, testbed):
    with pytest.raises(IndexError) as excinfo:
        client.get('/api/v1/names/')

    assert 'list index out of range' == str(excinfo.value)


def test_post_name(client, testbed):
    assert len(name.Name.query().fetch()) == 0

    response = client.post('/api/v1/names/', data={ 'name': 'c3po' })

    assert len(name.Name.query().fetch()) == 1
    assert json.loads(response.data) == { 'name': 'c3po' }
    assert response.status == '200 OK'


def test_post_name_maintains_max_11_names(client, testbed):
    assert len(name.Name.query().fetch()) == 0

    name_template = 'c3po{}'
    for n in xrange(11):
        name.Name(parent=name.root, name=name_template.format(n)).put()

    assert len(name.Name.query().fetch()) == 11

    client.post('/api/v1/names/', data={ 'name': 'r2d2' })

    assert len(name.Name.query().fetch()) == 11
    assert name.Name.query(name.Name.name == 'r2d2').count() == 1


def test_post_name_collision(client, testbed):
    response = client.post('/api/v1/names/', data={ 'name': 'c3po' })

    assert len(name.Name.query().fetch()) == 1
    assert response.status == '200 OK'

    response = client.post('/api/v1/names/', data={ 'name': 'c3po' })

    assert len(name.Name.query().fetch()) == 1
    assert response.status == '400 BAD REQUEST'
    assert json.loads(response.data) == {
        'message': { 'name': '"c3po" already exists' }
    }


def test_post_name_bad_data(client, testbed):
    assert len(name.Name.query().fetch()) == 0

    too_long_name = 'a' * 20
    response = client.post('/api/v1/names/', data={ 'name': too_long_name })

    assert len(name.Name.query().fetch()) == 0
    assert response.status == '400 BAD REQUEST'
    assert json.loads(response.data) == {
        'message': { 'name': 'must be no more than 10 characters long' }
    }

    too_short_name = ''
    response = client.post('/api/v1/names/', data={ 'name': too_short_name })

    assert len(name.Name.query().fetch()) == 0
    assert response.status == '400 BAD REQUEST'
    assert json.loads(response.data) == {
        'message': { 'name': 'must be at least 1 character long' }
    }
