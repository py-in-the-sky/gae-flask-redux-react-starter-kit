import graphene

from .scalar import NdbKey


def construct_from_ndb_entity(object_type, ndb_entity):
    field_names = [f.attname for f in object_type._meta.fields]
    kwargs = ndb_entity.to_dict(include=field_names)
    kwargs['id'] = ndb_entity.key
    return object_type(**kwargs)


class NdbObjectType(graphene.ObjectType):
    id = graphene.Field(NdbKey())

    @property
    def ndb_key(self):
        return self.id

    from_ndb_entity = classmethod(construct_from_ndb_entity)
