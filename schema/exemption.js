const BaseModel = require('./base-model');
const { moduleCodes } = require('@ukhomeoffice/asl-constants');
const { uuid } = require('../lib/regex-validation');

class Exemption extends BaseModel {
  static get tableName() {
    return 'exemptions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['profileId', 'module'],
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        module: { type: 'string', enum: moduleCodes },
        description: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' },
        species: {
          type: ['array', 'null'],
          items: { type: 'string' }
        }
      }
    };
  }
}

module.exports = Exemption;
