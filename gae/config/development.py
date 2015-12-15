from .config import Config
from werkzeug.debug import DebuggedApplication
from app.models.name import Name, root


class Development(Config):
    FLASK_CONFIG = 'development'

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        app.debug = True
        app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)
        # In order for debug to work with GAE, use DebuggedApplication.

        for droid_name in ('bb8', 'r2d2', 'c3po'):
            if Name.query(Name.name == droid_name).count() == 0:
                Name(parent=root, name=droid_name).put()
                # ensure minimal data for dev in datastore
                # no need to worry about a transaction
