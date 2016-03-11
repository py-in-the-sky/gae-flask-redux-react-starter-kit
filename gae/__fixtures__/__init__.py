from app.models.ndb.character import Character
from app.models.ndb.faction import Faction
from app.models.ndb.friendship import Friendship


def factions():
    resistance = Faction.get_by_name_or_create(
        name='The Resistance',
        description='Led by General Leia Organa, the Resistance fights the First Order.'
    )

    first_order = Faction.get_by_name_or_create(
        name='The First Order',
        description='Risen from the ashes of the Empire, the First Order is out to impose order on the Galaxy.'
    )

    return (resistance.key, first_order.key)


def characters(resistance_key, first_order_key):
    han = Character.create_or_get(
        name='Han',
        description='Captain of the Millennium Falcon.',
        faction=resistance_key
    )

    leia = Character.create_or_get(
        name='Leia',
        description='Leader of the Resistance.',
        faction=resistance_key
    )

    rey = Character.create_or_get(
        name='Rey',
        description='A new awakening in the Force.',
        faction=resistance_key
    )

    finn = Character.create_or_get(
        name='Finn',
        description='A former storm trooper who has joined the Resistance.',
        faction=resistance_key
    )

    kylo = Character.create_or_get(
        name='Kylo',
        description='Grandson and heir apparent to Darth Vader.',
        faction=first_order_key
    )

    snoke = Character.create_or_get(
        name='Snoke',
        description='Supreme Leader of the First Order.',
        faction=first_order_key
    )

    return dict(han=han, leia=leia, rey=rey, finn=finn, kylo=kylo, snoke=snoke)


def friendships(characters):
    Friendship.create_or_get(characters['han'], characters['leia'])
    Friendship.create_or_get(characters['han'], characters['rey'])
    Friendship.create_or_get(characters['han'], characters['finn'])
    Friendship.create_or_get(characters['rey'], characters['finn'])
    Friendship.create_or_get(characters['kylo'], characters['snoke'])


def ensure_minimal_data_in_datastore():
    resistance_key, first_order_key = factions()
    _characters = characters(resistance_key, first_order_key)
    friendships(_characters)
