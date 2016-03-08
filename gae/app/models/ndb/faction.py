from google.appengine.ext import ndb
from character import Character


class Faction(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    description = ndb.TextProperty(required=True)
    # image = ndb.BlobProperty(required=True)  # TODO: make a separate, linked entity that holds the image
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)

    def get_characters(self):
        faction_key = self.key
        q = Character.query(Character.faction == faction_key).order(Character.key)
        return q.fetch()
