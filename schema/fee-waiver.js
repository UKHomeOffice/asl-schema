const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class FeeWaiver extends BaseModel {
  static get tableName() {
    return 'feeWaivers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['pilId', 'establishmentId', 'year'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        pilId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        year: { type: 'integer' },
        comment: { type: 'text' },
        profileId: { type: 'string', pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      pil: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'feeWaivers.pilId',
          to: 'pils.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'feeWaivers.establishmentId',
          to: 'establishments.id'
        }
      },
      waivedBy: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'feeWaivers.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = FeeWaiver;
