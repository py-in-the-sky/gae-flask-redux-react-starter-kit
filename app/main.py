"""`main` is the top level module for your Flask application."""


def create_app():
    from flask import Flask
    app = Flask(__name__)

    from api import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    from os import environ
    if environ['SERVER_SOFTWARE'].startswith('Development'):
        from werkzeug.debug import DebuggedApplication
        app.debug = True
        app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)
        # In order for debug to work with GAE, use DebuggedApplication.

    return app


app = create_app()
# Note: We don't need to call run() since our application is
# embedded within the App Engine WSGI application server.
