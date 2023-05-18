const BaseModel = require('./base-model');
const { date, uuid } = require('../lib/regex-validation');
const { moduleCodes } = require('@ukhomeoffice/asl-constants');

class Certificate extends BaseModel {
  static get tableName() {
    return 'certificates';
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
          items: { type: 'string', enum: moduleCodes }
        },
        species: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        isExemption: { type: 'boolean' },
        exemptionReason: { type: ['string', 'null'] },
        passDate: { type: 'string', pattern: date.yearMonthDay },
        notApplicable: { type: 'boolean' },
        accreditingBody: { type: ['string', 'null'] },
        otherAccreditingBody: { type: ['string', 'null'] },
        certificateNumber: { type: ['string', 'null'] },
        profileId: { type: 'string', pattern: uuid.v4 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }
}

module.exports = Certificate;
