import pytest
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
