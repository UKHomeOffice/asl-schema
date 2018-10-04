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
      required: ['establishment_id', 'profile_id'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migrated_id: { type: ['string', 'null'] },
        status: { type: 'string', enum: pilStatuses },
        issue_date: { type: ['string', 'null'], format: 'date-time' },
        revocation_date: { type: ['string', 'null'], format: 'date-time' },
        licence_number: { type: ['string', 'null'] },
        conditions: { type: ['string', 'null'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        establishment_id: { type: 'integer' },
        profile_id: { type: 'string', pattern: uuid.v4 },
        deleted: { type: ['string', 'null'], format: 'date-time' },
        procedures: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        cat_d_notes: { type: ['string', 'null'] },
        cat_f_notes: { type: ['string', 'null'] }
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
