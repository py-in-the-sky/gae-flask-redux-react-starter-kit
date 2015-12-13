from google.appengine.ext import ndb


root = ndb.Key('NameRoot', 'name_root')


class Name(ndb.Model):
    name    = ndb.StringProperty(required=True)
    created = ndb.DateTimeProperty(required=True, auto_now_add=True)

    @classmethod
    def ensure_name_unique(cls, value):
        if cls.query(cls.name == value, ancestor=root).count() > 0:
            raise ValueError('"{}" already exists'.format(value))

        return value
