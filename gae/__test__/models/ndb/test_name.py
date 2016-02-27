from app.models.ndb import name
import pytest
import datetime
from google.appengine.ext.db import datastore_errors


def create_name(name_string):
    name_key = name.Name(parent=name.root, name=name_string).put()
    return name_key


def test_name(testbed):
    assert len(name.Name.query().fetch()) == 0
    create_name('c3po')
    assert len(name.Name.query().fetch()) == 1
    create_name('r2d2')
    assert len(name.Name.query().fetch()) == 2


def test_name_validation(testbed):
    with pytest.raises(datastore_errors.BadValueError) as excinfo:
        name.Name().put()

    assert 'Entity has uninitialized properties: name' == str(excinfo.value)


def test_name_created_auto_add(testbed):
    c3po = name.Name(name='c3po')
    assert c3po.created is None
    c3po.put()
    assert isinstance(c3po.created, datetime.datetime)


def test_name_ensure_name_not_in_datastore(testbed):
    return_value = name.Name.ensure_name_not_in_datastore('c3po')
    assert return_value == 'c3po'

    create_name('c3po')

    with pytest.raises(ValueError) as excinfo:
        name.Name.ensure_name_not_in_datastore('c3po')

    assert '"c3po" already exists' == str(excinfo.value)


def test_name_random_key(testbed):
    assert len(name.Name.query().fetch()) == 0

    with pytest.raises(IndexError) as excinfo1:
        name.Name.random_key()

    assert 'list index out of range' == str(excinfo1.value)

    c3po_key = create_name('c3po')

    assert len(name.Name.query().fetch()) == 1
    assert name.Name.random_key().get().name == 'c3po'

    with pytest.raises(IndexError) as excinfo2:
        name.Name.random_key(excluding=c3po_key)

    assert 'list index out of range' == str(excinfo2.value)

    create_name('r2d2')

    assert len(name.Name.query().fetch()) == 2
    assert name.Name.random_key(excluding=c3po_key).get().name == 'r2d2'
    assert name.Name.random_key().get().name in ('c3po', 'r2d2')
