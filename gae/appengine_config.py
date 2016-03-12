"""
`appengine_config.py` is automatically loaded when Google App Engine
starts a new instance of your application. This runs before any
WSGI applications specified in app.yaml are loaded.
see: https://github.com/GoogleCloudPlatform/appengine-flask-skeleton
"""


from google.appengine.ext import vendor
from os import path


def webapp_add_wsgi_middleware(app):
    # if os.getenv('SERVER_SOFTWARE', '').startswith('Dev'):
    from google.appengine.ext.appstats import recording
    app = recording.appstats_wsgi_middleware(app)
    return app


# Third-party libraries are stored in "__app_env__", vendoring will make
# sure that they are importable by the application.
app_rootdir = path.dirname(__file__)
vendor.add(path.join(app_rootdir, '__app_env__'))
