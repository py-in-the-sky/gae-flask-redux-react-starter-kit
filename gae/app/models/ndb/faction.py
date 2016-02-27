from google.appengine.ext import ndb
import character


root = ndb.Key('FactionRoot', 'faction_root')


class Faction(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    description = ndb.TextProperty(required=True)
    # image = ndb.BlobKeyProperty(required=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)

    def get_characters(self):
        faction_key = self.key
        q = character.Character.query(character.Character.faction == faction_key, ancestor=character.root)
        return q.fetch()
