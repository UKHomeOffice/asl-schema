const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class Changelog extends BaseModel {
  static get tableName() {
    return 'changelog';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'message'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        message: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], formate: 'date-time' }
      }
    };
  }
}

module.exports = Changelog;
