const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class FeeWaiver extends BaseModel {
  static get tableName() {
    return 'pilFeeWaivers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profileId', 'establishmentId', 'year'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        year: { type: 'integer' },
        comment: { type: 'text' },
        waivedById: { type: 'string', pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'pilFeeWaivers.profileId',
          to: 'profiles.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'pilFeeWaivers.establishmentId',
          to: 'establishments.id'
        }
      },
      waivedBy: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'pilFeeWaivers.waivedById',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = FeeWaiver;
