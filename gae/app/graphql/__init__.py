import graphene
# from app.models.ndb import name


# class Name(graphene.ObjectType):
#     name = graphene.String()


class Query(graphene.ObjectType):
    hello = graphene.String()
    ping = graphene.String(to=graphene.String())
    blah = graphene.String(n=graphene.Int())

    def resolve_hello(self, args, info):
        return 'World'

    def resolve_ping(self, args, info):
        return 'Pinging {}'.format(args.get('to'))

    def resolve_blah(self, args, info):
        return 'Blah' * args.get('n')


schema = graphene.Schema(query=Query)
