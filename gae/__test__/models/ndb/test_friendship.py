from app.models.ndb import friendship, character, faction
from collections import namedtuple
import pytest
import datetime
from google.appengine.ext.db import datastore_errors


def setup():
    TestSetup = namedtuple(
        'TestSetup',
        ('friendship', 'c3po', 'r2d2', 'resistance')
    )
    resistance = create_faction('The Resistance')
    c3po = create_character('C3PO', resistance)
    r2d2 = create_character('R2C2', resistance)
    friendship_key = friendship.Friendship.create_friendship(c3po, r2d2)
    return TestSetup(friendship_key, c3po, r2d2, resistance)


def create_character(name_string, faction):
    character_key = character.Character(
        parent=character.root,
        name=name_string,
        description='blah',
        faction=faction.key
    ).put()
    return character_key.get()


def create_faction(name_string):
    faction_key = faction.Faction(
        parent=faction.root,
        name=name_string,
        description='blah'
    ).put()
    return faction_key.get()


def test_friendship(testbed):
    test_setup = setup()
    assert test_setup.friendship.character1.get().name == test_setup.c3po.name
    assert test_setup.friendship.character2.get().name == test_setup.r2d2.name
    assert type(test_setup.friendship.created) == datetime.datetime


def test_friendship_get_friend(testbed):
    test_setup = setup()
    assert test_setup.friendship.get_friend(test_setup.c3po) == test_setup.r2d2


def test_friendship_get_friends(testbed):
    test_setup = setup()
    assert friendship.Friendship.get_friends(test_setup.c3po) == [test_setup.r2d2]

# def test_name_validation(testbed):
#     with pytest.raises(datastore_errors.BadValueError) as excinfo:
#         name.Name().put()
#
#     assert 'Entity has uninitialized properties: name' == str(excinfo.value)
#
#
# def test_name_created_auto_add(testbed):
#     c3po = name.Name(name='c3po')
#     assert c3po.created is None
#     c3po.put()
#     assert isinstance(c3po.created, datetime.datetime)
#
#
# def test_name_ensure_name_not_in_datastore(testbed):
#     return_value = name.Name.ensure_name_not_in_datastore('c3po')
#     assert return_value == 'c3po'
#
#     create_name('c3po')
#
#     with pytest.raises(ValueError) as excinfo:
#         name.Name.ensure_name_not_in_datastore('c3po')
#
#     assert '"c3po" already exists' == str(excinfo.value)
#
#
# def test_name_random_key(testbed):
#     assert len(name.Name.query().fetch()) == 0
#
#     with pytest.raises(IndexError) as excinfo1:
#         name.Name.random_key()
#
#     assert 'list index out of range' == str(excinfo1.value)
#
#     c3po_key = create_name('c3po')
#
#     assert len(name.Name.query().fetch()) == 1
#     assert name.Name.random_key().get().name == 'c3po'
#
#     with pytest.raises(IndexError) as excinfo2:
#         name.Name.random_key(excluding=c3po_key)
#
#     assert 'list index out of range' == str(excinfo2.value)
#
#     create_name('r2d2')
#
#     assert len(name.Name.query().fetch()) == 2
#     assert name.Name.random_key(excluding=c3po_key).get().name == 'r2d2'
#     assert name.Name.random_key().get().name in ('c3po', 'r2d2')
