from google.appengine.ext import ndb
import random


root = ndb.Key('NameRoot', 'name_root')


class Name(ndb.Model):
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)

    @classmethod
    def ensure_name_unique(cls, value):
        if ndb.Key(cls, value, parent=root).get():
            raise ValueError('"{}" already exists'.format(value))

        return value

    @classmethod
    def random_key(cls, excluding=None):
        limit = 10
        keys = cls.query(ancestor=root).fetch(limit, keys_only=True)

        if excluding:
            keys = [k for k in keys if k != excluding]

        return random.choice(keys)
