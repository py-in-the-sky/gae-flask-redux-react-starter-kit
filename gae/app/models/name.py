from google.appengine.ext import ndb


class Name(ndb.Model):
    # TODO: check memcache after model `get` or `create`
    # DONE: they appear in memcache after `get` but not `create`
    name    = ndb.StringProperty(required=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)

    # TODO: ensure only 10 exist in datastore at any one time; when a
    # new name is created and there are alredy 10, delete the oldest
    # one and then create the new one
