import graphene

from app.models.ndb.name import Name as NdbName
from .custom_types.compound import NdbObjectType
from .custom_types.scalar import DateTime


class Name(NdbObjectType):
    name = graphene.String()
    created = graphene.Field(DateTime())


class Query(graphene.ObjectType):
    hello = graphene.String()
    ping = graphene.String(to=graphene.String())
    blah = graphene.String(n=graphene.Int())
    name = graphene.Field(Name)

    def resolve_hello(self, args, info):
        return 'World'

    def resolve_ping(self, args, info):
        return 'Pinging {}'.format(args.get('to'))

    def resolve_blah(self, args, info):
        return 'Blah' * args.get('n')

    def resolve_name(self, args, info):
        random_name = NdbName.random_key().get()
        return Name.from_ndb_entity(random_name)


schema = graphene.Schema(query=Query)
