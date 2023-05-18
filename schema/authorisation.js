const BaseModel = require('./base-model');
const { authorisationTypes } = require('@ukhomeoffice/asl-constants');
const { uuid } = require('../lib/regex-validation');

class Authorisation extends BaseModel {
  static get tableName() {
    return 'authorisations';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type', 'method', 'description', 'establishmentId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        type: { type: 'string', enum: authorisationTypes },
        method: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }
}

module.exports = Authorisation;
