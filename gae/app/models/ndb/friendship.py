from google.appengine.ext import ndb


root = ndb.Key('FriendshipRoot', 'friendship_root')


class Friendship(ndb.Model):
    character1 = ndb.KeyProperty(required=True, kind='Character', indexed=True)
    character2 = ndb.KeyProperty(required=True, kind='Character', indexed=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)

    def get_friend(self, character):
        character_key = character.key
        friend_key = self.character2 if self.character1 == character_key else self.character1
        return friend_key.get()

    @classmethod
    def get_friends(cls, character):
        character_key = character.key
        q = cls.query(ndb.OR(cls.character1 == character_key, cls.character2 == character_key), ancestor=root)
        friendships = q.fetch()
        return [friendship.get_friend(character) for friendship in friendships]

    @classmethod
    @ndb.transactional
    def create_friendship(cls, character_a, character_b):
        if character_a == character_b:
            raise ValueError('"Friending" oneself is not allowed')

        cls.ensure_friendship_not_in_datastore(character_a, character_b)
        friendship_key = cls(parent=root, character1=character_a.key, character2=character_b.key).put()
        new_friendship = friendship_key.get()
        return new_friendship

    @classmethod
    def ensure_friendship_not_in_datastore(cls, character_a, character_b):
        q = cls.query(ndb.OR(ndb.AND(cls.character1 == character_a.key, cls.character2 == character_b.key),
                             ndb.AND(cls.character1 == character_b.key, cls.character2 == character_a.key)),
                      ancestor=root)

        if q.count() > 0:
            raise ValueError('{}-{} friendship already exists'.format(character_a.name, character_b.name))

        return character_a, character_b
