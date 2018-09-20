const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class TrainingModule extends BaseModel {
  static get tableName() {
    return 'trainingModules';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        'migrated_id': { type: ['string', 'null'] },
        module: { type: 'string' },
        species: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        pass_date: { type: 'string', format: 'date-time' },
        not_applicable: { type: 'boolean' },
        accrediting_body: { type: 'string' },
        other_accrediting_body: { type: 'string' },
        certificate_number: { type: 'string' },
        exemption: { type: 'boolean' },
        exemption_description: { type: 'text' },
        profileId: { type: 'string' },
        establishmentId: { type: 'integer' },
        'created_at': { type: 'string', format: 'date-time' },
        'updated_at': { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

}

module.exports = TrainingModule;
