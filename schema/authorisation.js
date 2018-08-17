const BaseModel = require('./base-model');
const { authorisationTypes } = require('@asl/constants');

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
        id: { type: 'string' },
        type: {
          type: 'string',
          enum: authorisationTypes
        },
        method: { type: 'string' },
        description: { type: 'string' },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' },
        establishmentId: { type: 'string' }
      }
    };
  }
}

module.exports = Authorisation;
