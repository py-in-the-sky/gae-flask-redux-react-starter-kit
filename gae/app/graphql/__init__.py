import graphene

from app.models.ndb.name import Name as NdbName
from app.models.ndb.faction import Faction as NdbFaction
from app.models.ndb.character import Character as NdbCharacter
from .custom_types.compound import NdbObjectType
from .custom_types.scalar import DateTime


class Character(NdbObjectType):
    name = graphene.String()
    description = graphene.String()
    created = graphene.Field(DateTime)
    updated = graphene.Field(DateTime)
    friends = graphene.List('Character')
    suggested = graphene.List('Character')
    faction = graphene.Field('Faction')

    def resolve_friends(self, args, info):
        friends = self.ndb_key.get().get_friends()
        return [Character.from_ndb_entity(f) for f in friends]

    def resolve_suggested(self, args, info):
        suggested = self.ndb_key.get().get_friends_of_friends()
        return [Character.from_ndb_entity(s) for s in suggested]

    def resolve_faction(self, args, info):
        faction = self.ndb_key.get().faction.get()
        return Faction.from_ndb_entity(faction)


class Faction(NdbObjectType):
    name = graphene.String()
    description = graphene.String()
    created = graphene.Field(DateTime)
    updated = graphene.Field(DateTime)
    characters = graphene.List(Character)

    def resolve_characters(self, args, info):
        characters = self.ndb_key.get().get_characters()
        return [Character.from_ndb_entity(c) for c in characters]


class Name(NdbObjectType):
    name = graphene.String()
    created = graphene.Field(DateTime)


class Query(graphene.ObjectType):
    name = graphene.Field(Name)
    factions = graphene.List(Faction)
    characters = graphene.List(Character)

    def resolve_name(self, args, info):
        random_name = NdbName.random_key().get()
        return Name.from_ndb_entity(random_name)

    def resolve_factions(self, args, info):
        factions = NdbFaction.query().fetch()
        return [Faction.from_ndb_entity(f) for f in factions]

    def resolve_characters(self, args, info):
        characters = NdbCharacter.query().fetch()
        return [Character.from_ndb_entity(c) for c in characters]


schema = graphene.Schema(query=Query)
