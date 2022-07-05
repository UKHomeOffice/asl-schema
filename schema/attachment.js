const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class Attachment extends BaseModel {
  static get tableName() {
    return 'attachments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['mimetype', 'filename', 'token'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        mimetype: { type: 'string' },
        filename: { type: 'string' },
        token: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }
}

module.exports = Attachment;
