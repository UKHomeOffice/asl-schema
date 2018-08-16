const BaseModel = require('./base-model');

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
        'migrated_id': { type: 'string' },
        type: {
          type: 'string',
          enum: ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'holc']
        },
        establishmentId: { type: 'string' },
        profileId: { type: 'string' },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'roles.profileId',
          to: 'profiles.id'
        }
      },
      places: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/place`,
        join: {
          from: 'roles.id',
          to: 'places.nacwoId'
        }
      }
    };
  }

  getProfile() {
    return this.$relatedQuery('profile');
  }
}

module.exports = Role;
