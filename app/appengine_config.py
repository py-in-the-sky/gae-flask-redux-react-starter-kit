"""
`appengine_config.py` is automatically loaded when Google App Engine
starts a new instance of your application. This runs before any
WSGI applications specified in app.yaml are loaded.
see: https://github.com/GoogleCloudPlatform/appengine-flask-skeleton
"""


from google.appengine.ext import vendor


# Third-party libraries are stored in "__app_env__", vendoring will make
# sure that they are importable by the application.
vendor.add('__app_env__')
