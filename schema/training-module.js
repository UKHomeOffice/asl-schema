const BaseModel = require('./base-model');
const { date, uuid } = require('../lib/regex-validation');

class TrainingModule extends BaseModel {
  static get tableName() {
    return 'training_modules';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profile_id'],
      additionalProperties: false,
      properties: {
        id: { type: ['string', 'null'], pattern: uuid.v4 },
        migrated_id: { type: ['string', 'null'] },
        modules: {
          type: ['array', 'null'],
          items: {
            type: 'object',
            properties: {
              module: { type: 'string' },
              species: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        pass_date: { type: 'string', pattern: date.yearMonthDay },
        not_applicable: { type: ['boolean', 'null'] },
        accrediting_body: { type: ['string', 'null'] },
        other_accrediting_body: { type: ['string', 'null'] },
        certificate_number: { type: ['string', 'null'] },
        exemption: { type: ['boolean', 'null'] },
        exemption_description: { type: ['text', 'null'] },
        profile_id: { type: 'string', pattern: uuid.v4 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

}

module.exports = TrainingModule;
