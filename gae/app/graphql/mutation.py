import graphene
from google.appengine.ext import ndb

from app.models.ndb.character import Character as NdbCharacter
from app.models.ndb.friendship import Friendship as NdbFriendship
from .custom_types.scalar import NdbKey
from .query import Character


class CreateCharacter(graphene.Mutation):
    class Input:
        name = graphene.String().NonNull
        description = graphene.String().NonNull
        faction = graphene.NonNull(NdbKey)

    ok = graphene.Boolean().NonNull
    character = graphene.NonNull(Character)

    @classmethod
    def mutate(cls, instance, args, info):
        character = NdbCharacter.create(**args)
        return cls(character=Character.from_ndb_entity(character), ok=True)


class CreateFriendship(graphene.Mutation):
    class Input:
        character_a = graphene.NonNull(NdbKey)
        character_b = graphene.NonNull(NdbKey)

    ok = graphene.Boolean().NonNull
    character_a = graphene.NonNull(Character)
    character_b = graphene.NonNull(Character)

    @classmethod
    def mutate(cls, instance, args, info):
        characters = ndb.get_multi([args['character_a'], args['character_b']])
        # TODO: see TODO in frienship model about create taking keys instead of entities
        friendship = NdbFriendship.create(*characters)
        character_a, character_b = [Character.from_ndb_entity(f) for f in friendship.get_friends()]
        return cls(ok=True, character_a=character_a, character_b=character_b)


class Mutation(graphene.ObjectType):
    create_character = graphene.Field(CreateCharacter)
    create_friendship = graphene.Field(CreateFriendship)
