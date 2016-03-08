from google.appengine.ext import ndb


root = ndb.Key('FriendshipRoot', 'friendship_root')


class Friendship(ndb.Model):
    character1 = ndb.KeyProperty(required=True, kind='Character', indexed=True)
    character2 = ndb.KeyProperty(required=True, kind='Character', indexed=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)
    updated = ndb.DateTimeProperty(required=True, auto_now_add=True, auto_now=True)

    def get_friend(self, character):
        # TODO: After rewriting `get_friends` if this is no longer used anywhere, remove it.
        character_key = character.key
        friend_key = self.character2 if self.character1 == character_key else self.character1
        return friend_key.get()

    @classmethod
    def get_friends(cls, character, cursor=None, page_size=4):
        # TODO: Try a projection query that returns character2 if character is character1 and
        # character1 otherwise.
        # TODO: Wrap this up in a sync tasklet that'll fetch the two queries concurrently
        # and get all the characters from the character keys concurrently and in batches
        # before returning all the characters.
        # TODO: The structure of Friendship doesn't seem to support query cursors very well.
        # Additionally, the current query is already complex and may be hard to change in
        # the future.  Instead, look into having a single `character` property that's a
        # repeated KeyProperty with a custom validator to ensure only two values are
        # stored under it (one key for each friend).
        # See:
        #   https://cloud.google.com/appengine/docs/python/ndb/properties#options
        #   https://cloud.google.com/appengine/docs/python/ndb/properties#repeated
        # This may not work.  See:
        #   https://cloud.google.com/appengine/docs/python/ndb/projectionqueries#Python_Limitations_on_projections
        # perhaps order by `created`
        character_key = character.key
        q = cls.query(ndb.OR(cls.character1 == character_key, cls.character2 == character_key))
        friendships = q.order(cls.character1).order(cls.character2).fetch()
        return [fs.get_friend(character) for fs in friendships]  # TODO: async and batched

    @classmethod
    def get_friends_of_friends(cls, character, cursor=None, page_size=4):
        friends = cls.get_friends(character, None, None)
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
