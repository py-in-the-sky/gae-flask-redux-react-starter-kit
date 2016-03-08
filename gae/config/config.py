from google.appengine.ext import ndb


class Config:
    BUNDLE_ERRORS = True
    # see: http://flask-restful-cn.readthedocs.org/en/0.3.4/reqparse.html#error-handling

    @classmethod
    def init_app(cls, app):
        app.wsgi_app = ndb.toplevel(app.wsgi_app)  # TODO: test
        # See: https://cloud.google.com/appengine/docs/python/ndb/async
