const BaseModel = require('./base-model');
const { roles } = require('@ukhomeoffice/asl-constants');

class Role extends BaseModel {
  static get tableName() {
    return 'roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type', 'establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        migratedId: { type: ['string', 'null'] },
        type: {
          type: 'string',
          enum: roles
        },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'roles.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'roles.profileId',
          to: 'profiles.id'
        }
      },
      places: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/place`,
        join: {
          from: 'roles.id',
          through: {
            from: 'placeRoles.roleId',
            to: 'placeRoles.placeId'
          },
          to: 'places.id'
        }
      }
    };
  }

  getProfile() {
    return this.$relatedQuery('profile');
  }
}

module.exports = Role;
