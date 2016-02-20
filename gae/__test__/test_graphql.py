from app.graphql import schema
from app.models.ndb import name


def create_name(name_string):
    name_key = name.Name(parent=name.root, name=name_string).put()
    return name_key


def test_schema(testbed):
    create_name('c3po')
    result = schema.execute('''
        query {
          blah(n:4)
          name {
            name
          }
        }
    ''')

    assert result.data['blah'] == 'Blah' * 4
    assert result.data['name']['name'] == 'c3po'
