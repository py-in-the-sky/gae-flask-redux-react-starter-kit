from google.appengine.ext import ndb

from .friendship import Friendship


root = ndb.Key('CharacterRoot', 'character_root')


class Character(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    description = ndb.TextProperty(required=True)
    faction = ndb.KeyProperty(required=True, kind='Faction', indexed=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)
    # image = ndb.BlobProperty()  # TODO: make a separate, linked entity that holds the image

    def get_friends(self):
        return Friendship.get_friends(self)

    def get_friends_of_friends(self):
        return Friendship.get_friends_of_friends(self)

    @classmethod
    @ndb.transactional
    def create_character(cls, **kwargs):
        cls.ensure_character_name_not_in_datastore(kwargs.get('name'))

        character_key = cls(parent=root, **kwargs).put()
        new_character = character_key.get()
        return new_character

    @classmethod
    def ensure_character_name_not_in_datastore(cls, name):
        if not name:
            return name

        if cls.query(cls.name == name, ancestor=root).count() > 0:
            raise ValueError('"{}" already exists'.format(name))

        return name
