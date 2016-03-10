import datetime
from collections import namedtuple

import pytest

from app.models.ndb import character, faction


@pytest.fixture(scope='function')
def setup(testbed, data_wrapper):
    resistance = create_faction('The Resistance')
    c3po = create_character('C3PO', resistance)
    return data_wrapper(c3po, resistance)


@pytest.fixture(scope='module')
def data_wrapper():
    return namedtuple('DataWrapper', ('c3po', 'resistance'))


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
    assert setup.c3po.name == 'C3PO'
    assert setup.c3po.description == 'blah'
    assert setup.c3po.faction.get().name == 'The Resistance'
    assert isinstance(setup.c3po.created, datetime.datetime)


def test_ensure_character_name_not_in_datastore(setup):
    with pytest.raises(ValueError) as excinfo:
        character.Character.ensure_character_name_not_in_datastore('C3PO')

    assert str(excinfo.value) == '"C3PO" already exists'

    name = character.Character.ensure_character_name_not_in_datastore('Han')
    assert name == 'Han'


def test_create_character(setup):
    kwargs = dict(
        name='C3PO',
        description='blah',
        faction=setup.resistance.key
    )

    with pytest.raises(ValueError) as excinfo:
        character.Character.create_character(**kwargs)

    assert str(excinfo.value) == '"C3PO" already exists'

    kwargs['name'] = 'Han'
    new_character = character.Character.create_character(**kwargs)
    assert new_character.name == 'Han'
