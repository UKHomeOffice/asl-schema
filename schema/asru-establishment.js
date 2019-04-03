const BaseModel = require('./base-model');

class AsruEstablishment extends BaseModel {
  static get tableName() {
    return 'asru_establishment';
  }

  static get idColumn() {
    return ['establishmentId', 'profileId'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
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
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'asru_establishment.profileId',
          to: 'profiles.id'
        }
      }
    };
  }

  getProfile() {
    return this.$relatedQuery('profile');
  }
}

module.exports = AsruEstablishment;
