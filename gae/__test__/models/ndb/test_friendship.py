from app.models.ndb import friendship, character, faction
from collections import namedtuple
import pytest
import datetime


@pytest.yield_fixture(scope='function')
def test_setup(testbed):
    TestSetup = namedtuple(
        'TestSetup',
        ('friendship', 'c3po', 'r2d2', 'resistance')
    )
    resistance = create_faction('The Resistance')
    c3po = create_character('C3PO', resistance)
    r2d2 = create_character('R2D2', resistance)
    f = friendship.Friendship.create_friendship(c3po, r2d2)
    yield TestSetup(f, c3po, r2d2, resistance)


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
        name=name_string,
        description='blah'
    ).put()
    return faction_key.get()


def test_properties(test_setup):
    assert test_setup.friendship.character1.get().name == test_setup.c3po.name
    assert test_setup.friendship.character2.get().name == test_setup.r2d2.name
    assert isinstance(test_setup.friendship.created, datetime.datetime)


def test_get_friend(test_setup):
    assert test_setup.friendship.get_friend(test_setup.c3po) == test_setup.r2d2
    assert test_setup.friendship.get_friend(test_setup.r2d2) == test_setup.c3po


def test_get_friends(test_setup):
    assert friendship.Friendship.get_friends(test_setup.c3po) == [test_setup.r2d2]

    bb8 = create_character('BB8', test_setup.resistance)
    friendship.Friendship.create_friendship(test_setup.r2d2, bb8)

    assert friendship.Friendship.get_friends(test_setup.r2d2) == [test_setup.c3po, bb8]


def test_ensure_friendship_not_in_datastore(test_setup):
    with pytest.raises(ValueError) as excinfo:
        friendship.Friendship.ensure_friendship_not_in_datastore(test_setup.c3po, test_setup.r2d2)

    assert str(excinfo.value) == 'C3PO-R2D2 friendship already exists'

    bb8 = create_character('BB8', test_setup.resistance)
    check = friendship.Friendship.ensure_friendship_not_in_datastore(bb8, test_setup.r2d2)

    assert check == (bb8, test_setup.r2d2)


def test_create_friendship(test_setup):
    """
    Tested:
        * friendships are unique in the datastore
        * no self-friending allowed
        * character1's name is lexicographically less than character2's
    """
    with pytest.raises(ValueError) as excinfo1:
        friendship.Friendship.create_friendship(test_setup.r2d2, test_setup.c3po)

    assert str(excinfo1.value) == 'R2D2-C3PO friendship already exists'

    with pytest.raises(ValueError) as excinfo2:
        friendship.Friendship.create_friendship(test_setup.r2d2, test_setup.r2d2)

    assert str(excinfo2.value) == '"Friending" oneself is not allowed'

    bb8 = create_character('BB8', test_setup.resistance)
    new_friendship = friendship.Friendship.create_friendship(test_setup.r2d2, bb8)

    assert new_friendship.character1 == bb8.key
    assert new_friendship.character2 == test_setup.r2d2.key
