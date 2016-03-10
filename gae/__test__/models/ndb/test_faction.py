import datetime
from collections import namedtuple

import pytest

from app.models.ndb import character, faction


@pytest.fixture(scope='function')
def setup(testbed, data_wrapper):
    resistance = create_faction('The Resistance')
    first_order = create_faction('The First Order')
    c3po = create_character('C3PO', resistance)
    r2d2 = create_character('R2D2', resistance)
    kylo = create_character('Kylo Ren', first_order)
    return data_wrapper(resistance, first_order, c3po, r2d2, kylo)


@pytest.fixture(scope='module')
def data_wrapper():
    return namedtuple(
        'DataWrapper',
        ('resistance', 'first_order', 'c3po', 'r2d2', 'kylo')
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
    assert setup.resistance.name == 'The Resistance'
    assert setup.resistance.description == 'blah'
    assert isinstance(setup.resistance.created, datetime.datetime)
    assert isinstance(setup.resistance.updated, datetime.datetime)


def test_get_characters(setup):
    """
    Tested:
        * characters properly retrieved
        * characters returned in lexicographic order by name
    """
    assert setup.resistance.get_characters() == [setup.c3po, setup.r2d2]
    assert setup.first_order.get_characters() == [setup.kylo]
