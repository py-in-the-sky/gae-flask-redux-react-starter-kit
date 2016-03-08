from google.appengine.ext import ndb

from friendship import Friendship


root = ndb.Key('CharacterRoot', 'character_root')


class Character(ndb.Model):
    name = ndb.StringProperty(required=True, indexed=True)
    description = ndb.TextProperty(required=True)
    faction = ndb.KeyProperty(required=True, kind='Faction', indexed=True)
    # image = ndb.BlobProperty()  # TODO: make a separate, linked entity that holds the image
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)

    def get_friends(self):
        return Friendship.get_friends(self)

    def get_friends_of_friends(self):
        # TODO: Defer to efficient Friendship query:
        # return Friendship.get_friends_of_friends(self)
        friends = self.get_friends()

        own_key = self.key
        friends_keys = [f.key for f in friends]
        friends_of_friends_keys = set(f2.key for f1 in friends for f2 in f1.get_friends())

        friends_of_friends = [key.get() for key in friends_of_friends_keys
                              if key not in friends_keys and key != own_key]
        return friends_of_friends

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
