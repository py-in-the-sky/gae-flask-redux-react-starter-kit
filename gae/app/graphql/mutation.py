import graphene

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
        return cls(
            character=Character.from_ndb_entity(character),
            ok=bool(character)
        )


class CreateFriendship(graphene.Mutation):
    class Input:
        character_a = graphene.NonNull(NdbKey)
        character_b = graphene.NonNull(NdbKey)

    ok = graphene.Boolean().NonNull

    @classmethod
    def mutate(cls, instance, args, info):
        friendship = NdbFriendship.create_from_keys(args['character_a'], args['character_b'])
        return cls(ok=bool(friendship))


class Mutation(graphene.ObjectType):
    create_character = graphene.Field(CreateCharacter)
    create_friendship = graphene.Field(CreateFriendship)
