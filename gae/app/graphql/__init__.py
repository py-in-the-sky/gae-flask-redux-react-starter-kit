import graphene

from .query import Query
from .mutation import Mutation


schema = graphene.Schema(query=Query, mutation=Mutation)
