const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class Notification extends BaseModel {
  static get tableName() {
    return 'notifications';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        to: { type: 'string' },
        name: { type: 'string' },
        subject: { type: 'string' },
        html: { type: 'string' },
        identifier: { type: 'string' },
        completed: { type: ['string', 'null'], format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

}

module.exports = Notification;
