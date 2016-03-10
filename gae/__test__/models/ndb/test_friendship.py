import datetime
from collections import namedtuple

import pytest

from app.models.ndb import friendship, character, faction


@pytest.fixture(scope='function')
def setup(testbed, data_wrapper):
    resistance = create_faction('The Resistance')
    c3po = create_character('C3PO', resistance)
    r2d2 = create_character('R2D2', resistance)
    f = friendship.Friendship.create_friendship(c3po, r2d2)

    bb8 = create_character('BB8', resistance)
    han = create_character('Han', resistance)
    friendship.Friendship.create_friendship(bb8, r2d2)
    friendship.Friendship.create_friendship(han, r2d2)

    create_character('Mr. McNofriends', resistance)

    return data_wrapper(f, c3po, r2d2, bb8, han, resistance)


@pytest.fixture(scope='module')
def data_wrapper():
    return namedtuple(
        'DataWrapper',
        ('friendship', 'c3po', 'r2d2', 'bb8', 'han', 'resistance')
    )


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


def test_properties(setup):
    assert setup.friendship.character1.get().name == setup.c3po.name
    assert setup.friendship.character2.get().name == setup.r2d2.name
    assert isinstance(setup.friendship.created, datetime.datetime)


def test_get_friends(setup):
    assert friendship.Friendship.get_friends(setup.c3po) == [setup.r2d2]

    friendship.Friendship.create_friendship(setup.c3po, setup.bb8)
    assert friendship.Friendship.get_friends(setup.c3po) == [setup.r2d2, setup.bb8]


def test_get_friends_of_friends(setup):
    """
    Tested:
        * just friends-of-friends returned; not self or friends
        * friends-of-friends returned in lexicographic order by name
    """
    fof = friendship.Friendship.get_friends_of_friends(setup.c3po)
    assert fof == [setup.bb8, setup.han]

    abc = create_character('ABC', setup.resistance)
    friendship.Friendship.create_friendship(setup.r2d2, abc)
    fof = friendship.Friendship.get_friends_of_friends(setup.c3po)
    assert fof == [abc, setup.bb8, setup.han]

    xyz = create_character('XYZ', setup.resistance)
    friendship.Friendship.create_friendship(xyz, setup.r2d2)
    fof = friendship.Friendship.get_friends_of_friends(setup.c3po)
    assert fof == [abc, setup.bb8, setup.han, xyz]


def test_ensure_friendship_not_in_datastore(setup):
    with pytest.raises(ValueError) as excinfo:
        friendship.Friendship.ensure_friendship_not_in_datastore(setup.c3po, setup.r2d2)

    assert str(excinfo.value) == 'C3PO-R2D2 friendship already exists'

    bb8 = create_character('BB8', setup.resistance)
    check = friendship.Friendship.ensure_friendship_not_in_datastore(bb8, setup.r2d2)

    assert check == (bb8, setup.r2d2)


def test_create_friendship(setup):
    """
    Tested:
        * friendships are unique in the datastore
        * no self-friending allowed
        * character1's name is lexicographically less than character2's
    """
    with pytest.raises(ValueError) as excinfo1:
        friendship.Friendship.create_friendship(setup.r2d2, setup.c3po)

    assert str(excinfo1.value) == 'R2D2-C3PO friendship already exists'

    with pytest.raises(ValueError) as excinfo2:
        friendship.Friendship.create_friendship(setup.r2d2, setup.r2d2)

    assert str(excinfo2.value) == '"Friending" oneself is not allowed'

    bb8 = create_character('BB8', setup.resistance)
    new_friendship = friendship.Friendship.create_friendship(setup.r2d2, bb8)

    assert new_friendship.character1 == bb8.key
    assert new_friendship.character2 == setup.r2d2.key
