const BaseModel = require('./base-model');
const { pilStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

class PIL extends BaseModel {
  static get tableName() {
    return 'pils';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['establishmentId', 'profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        'migrated_id': { type: ['string', 'null'] },
        status: { type: 'string', enum: pilStatuses },
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        conditions: { type: ['string', 'null'] },
        'created_at': { type: 'string', format: 'date-time' },
        'updated_at': { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'pils.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'pils.profileId',
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = PIL;
