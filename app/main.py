"""`main` is the top level module for your Flask application."""


def create_app():
    from flask import Flask, jsonify
    app = Flask(__name__)


    @app.errorhandler(404)
    def not_found(e):
        """Return a custom 404 error."""
        return jsonify({ 'message': 'Sorry, Nothing at this URL.' }), 404


    @app.errorhandler(500)
    def application_error(e):
        """Return a custom 500 error."""
        message = 'Sorry, unexpected error: {}'.format(e)
        return jsonify({ 'message': message }), 500


    from api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    from os import environ
    if environ['SERVER_SOFTWARE'].startswith('Development'):
        from werkzeug.debug import DebuggedApplication
        app.debug = True
        return DebuggedApplication(app, evalex=True)
        # In order for debug to work with GAE, use DebuggedApplication.
        # Note: We don't need to call run() since our application is
        # embedded within the App Engine WSGI application server.
    else:
        return app


app = create_app()
