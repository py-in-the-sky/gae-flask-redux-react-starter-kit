from google.appengine.ext import ndb

from .character import Character


class Faction(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    description = ndb.TextProperty(required=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)
    # image = ndb.BlobProperty(required=True)  # TODO: make a separate, linked entity that holds the image

    def get_characters(self):
        return Character\
            .query(Character.faction == self.key)\
            .order(Character.name)\
            .fetch()
