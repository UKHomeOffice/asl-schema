const BaseModel = require('./base-model');
const { pilStatuses } = require('@asl/constants');

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
        id: { type: 'string' },
        'migrated_id': { type: 'string' },
        status: {
          type: 'string',
          enum: pilStatuses
        },
        issueDate: { type: ['string', 'null'] },
        revocationDate: { type: ['string', 'null'] },
        licenceNumber: { type: ['string', 'null'] },
        conditions: { type: ['string', 'null'] },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' }
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
