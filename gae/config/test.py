from .config import Config


class Test(Config):
    FLASK_CONFIG = 'test'
    TESTING      = True
    # Disables error catching during request handling,
    # resulting in better error reports when performing
    # test requests against the application.
    # See: http://flask.pocoo.org/docs/0.10/testing/#the-testing-skeleton
