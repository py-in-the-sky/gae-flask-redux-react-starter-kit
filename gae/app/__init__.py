def create_app(debug):
    from flask import Flask
    app = Flask(__name__)

    from .api import api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    if debug:
        from werkzeug.debug import DebuggedApplication
        app.debug = True
        app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)
        # In order for debug to work with GAE, use DebuggedApplication.

    return app
