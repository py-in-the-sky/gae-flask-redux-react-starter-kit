from .config import Config
from werkzeug.debug import DebuggedApplication
from werkzeug.contrib.profiler import ProfilerMiddleware
from app.models.ndb.name import Name, root


DEBUG = 1
PROFILE = 1


class Development(Config):
    FLASK_CONFIG = 'development'

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        if DEBUG:
            app.debug = True
            app.wsgi_app = DebuggedApplication(app.wsgi_app,
                                               evalex=True,
                                               console_path='/_console')
            # In order for debug to work with GAE, use DebuggedApplication.

        if PROFILE:
            app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=('gae/app', 10))
            # For each HTTP request, log top ten slowest functions from the
            # source code in the `gae/app` directory.

        for droid_name in ('bb8', 'r2d2', 'c3po'):
            if Name.query(Name.name == droid_name).count() == 0:
                Name(parent=root, name=droid_name).put()
                # ensure minimal data for dev in datastore
                # no need to worry about a transaction
