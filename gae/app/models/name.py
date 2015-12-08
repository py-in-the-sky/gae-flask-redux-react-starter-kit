from google.appengine.ext import ndb


class Name(ndb.Model):
    name    = ndb.StringProperty(required=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
