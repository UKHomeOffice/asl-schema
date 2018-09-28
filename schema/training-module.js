const BaseModel = require('./base-model');
const { date, uuid } = require('../lib/regex-validation');

class TrainingModule extends BaseModel {
  static get tableName() {
    return 'training_modules';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profile_id', 'module'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migrated_id: { type: ['string', 'null'] },
        module: { type: 'string' },
        species: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        pass_date: { type: 'string', pattern: date.yearMonthDay },
        not_applicable: { type: 'boolean' },
        accrediting_body: { type: 'string' },
        other_accrediting_body: { type: 'string' },
        certificate_number: { type: 'string' },
        exemption: { type: 'boolean' },
        exemption_description: { type: 'text' },
        profile_id: { type: 'string', pattern: uuid.v4 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

}

module.exports = TrainingModule;
