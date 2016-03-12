import graphene

from app.models.ndb.faction import Faction as NdbFaction
from app.models.ndb.character import Character as NdbCharacter
from .custom_types.compound import NdbObjectType
from .custom_types.scalar import DateTime, NdbKey


class Character(NdbObjectType):
    name = graphene.String()
    description = graphene.String()
    created = graphene.Field(DateTime)
    updated = graphene.Field(DateTime)
    friends = graphene.List('Character')
    suggested = graphene.List('Character')
    faction = graphene.Field('Faction')

    def resolve_friends(self, args, info):
        friends = self.key.get().get_friends()
        return [Character.from_ndb_entity(f) for f in friends]

    def resolve_suggested(self, args, info):
        suggested = self.key.get().get_friends_of_friends()
        return [Character.from_ndb_entity(s) for s in suggested]

    def resolve_faction(self, args, info):
        faction = self.key.get().faction.get()
        return Faction.from_ndb_entity(faction)


class Faction(NdbObjectType):
    name = graphene.String()
    description = graphene.String()
    created = graphene.Field(DateTime)
    updated = graphene.Field(DateTime)
    characters = graphene.List(Character)

    def resolve_characters(self, args, info):
        characters = self.key.get().get_characters()
        return [Character.from_ndb_entity(c) for c in characters]


class Query(graphene.ObjectType):
    faction = graphene.Field(
        Faction,
        key=graphene.Argument(NdbKey),
        name=graphene.String(),
    )
    factions = graphene.List(Faction)
    character = graphene.Field(
        Character,
        key=graphene.Argument(NdbKey),
        name=graphene.String(),
    )
    characters = graphene.List(Character)

    def resolve_faction(self, args, info):
        faction_key = args.get('key')
        if faction_key:
            return Faction.from_ndb_entity(faction_key.get())

        faction_name = args.get('name')
        if faction_name:
            faction = NdbFaction.get_by_name(faction_name)
            return Faction.from_ndb_entity(faction)

    def resolve_factions(self, args, info):
        factions = NdbFaction.query().fetch()
        return [Faction.from_ndb_entity(f) for f in factions]

    def resolve_character(self, args, info):
        character_key = args.get('key')
        if character_key:
            return Character.from_ndb_entity(character_key.get())

        character_name = args.get('name')
        if character_name:
            character = NdbCharacter.get_by_name(character_name)
            return Character.from_ndb_entity(character)

    def resolve_characters(self, args, info):
        characters = NdbCharacter.query().fetch()
        return [Character.from_ndb_entity(c) for c in characters]
