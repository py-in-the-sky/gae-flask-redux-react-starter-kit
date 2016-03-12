from google.appengine.ext import ndb

from .friendship import Friendship


root = ndb.Key('CharacterRoot', 'character_root')


class Character(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    description = ndb.TextProperty(required=True)
    faction = ndb.KeyProperty(required=True, kind='Faction', indexed=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)

    def get_friends(self):
        return Friendship.get_friends(self)

    def get_friends_of_friends(self):
        return Friendship.get_friends_of_friends(self)

    @classmethod
    @ndb.transactional
    def create(cls, **kwargs):
        cls.ensure_name_not_in_datastore(kwargs.get('name'))

        character_key = cls(parent=root, **kwargs).put()
        new_character = character_key.get()
        return new_character

    @classmethod
    def ensure_name_not_in_datastore(cls, name):
        if not name:
            return name

        if cls.query(cls.name == name, ancestor=root).count() > 0:
            raise ValueError('"{}" already exists'.format(name))

        return name

    @classmethod
    @ndb.transactional
    def create_or_get(cls, **kwargs):
        try:
            return cls.create(**kwargs)
        except ValueError:
            name = kwargs['name']
            return cls.get_by_name(name)

    @classmethod
    def get_by_name(cls, name):
        return cls.query(cls.name == name, ancestor=root).get()
