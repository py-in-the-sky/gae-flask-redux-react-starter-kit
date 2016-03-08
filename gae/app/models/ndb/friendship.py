from google.appengine.ext import ndb


root = ndb.Key('FriendshipRoot', 'friendship_root')


class Friendship(ndb.Model):
    character1 = ndb.KeyProperty(required=True, kind='Character', indexed=True)
    character2 = ndb.KeyProperty(required=True, kind='Character', indexed=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)

    def get_friend(self, character):
        return self._get_friend_key(character).get()

    def _get_friend_key(self, character):
        character_key = character.key
        friend_key = self.character2 if self.character1 == character_key else self.character1
        return friend_key

    @classmethod
    def get_friends(cls, character):
        friends_keys = cls._get_friends_keys(character)
        return ndb.get_multi(friends_keys)

    @classmethod
    def _get_friends_keys(cls, character):
        character_key = character.key
        q = cls.query(ndb.OR(
            cls.character1 == character_key,
            cls.character2 == character_key
        ))
        friendships = q.fetch()
        return [fs._get_friend_key(character) for fs in friendships]

    @classmethod
    def get_friends_of_friends(cls, character):
        character_key = character.key
        friends_keys = cls._get_friends_keys(character)
        q1 = cls.query(
            ndb.AND(cls.character1.IN(friends_keys), cls.character1 != character_key),
            projection=[cls.character2],
            distinct=True
        )
        q2 = cls.query(
            ndb.AND(
                cls.character2.IN(friends_keys),
                cls.character2 != character_key
            ),
            projection=[cls.character2],
            distinct=True
        )
        q = cls.query(ndb.OR(q1, q2), distinct=True)


        friends = cls.get_friends(character)
        friends_keys = [f.key for f in friends]
        q1 = cls.query(cls.character1.IN(friends_keys), projection=[cls.character2], distinct=True)
        q2 = cls.query(cls.character2.IN(friends_keys), projection=[cls.character1], distinct=True)
        # TODO

    @classmethod
    @ndb.transactional
    def create_friendship(cls, character_a, character_b):
        if character_a == character_b:
            raise ValueError('"Friending" oneself is not allowed')

        cls.ensure_friendship_not_in_datastore(character_a, character_b)

        ch1, ch2 = sorted((character_a, character_b), key=lambda character: character.name)
        friendship_key = cls(parent=root, character1=ch1.key, character2=ch2.key).put()
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
