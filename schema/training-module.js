const BaseModel = require('./base-model');
const { date, uuid } = require('../lib/regex-validation');

class TrainingModule extends BaseModel {
  static get tableName() {
    return 'training_modules';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profileId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migratedId: { type: ['string', 'null'] },
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
        passDate: { type: 'string', pattern: date.yearMonthDay },
        notApplicable: { type: 'boolean' },
        accreditingBody: { type: ['string', 'null'] },
        otherAccreditingBody: { type: ['string', 'null'] },
        certificateNumber: { type: ['string', 'null'] },
        exemption: { type: 'boolean' },
        exemptionDescription: { type: ['text', 'null'] },
        profileId: { type: 'string', pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

}

module.exports = TrainingModule;
