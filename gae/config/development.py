from .config import Config
from werkzeug.debug import DebuggedApplication


class Development(Config):
    FLASK_CONFIG = 'development'

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        app.debug = True
        app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)
        # In order for debug to work with GAE, use DebuggedApplication.
