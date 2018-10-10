const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class Changelog extends BaseModel {
  static get tableName() {
    return 'changelog';
  }

  static get idColumn() {
    return 'message_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['messageId', 'changedBy', 'modelId', 'action', 'modelType', 'state'],
      additionalProperties: false,
      properties: {
        messageId: { type: 'string', pattern: uuid.v4 },
        changedBy: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: ['string', 'null'], pattern: uuid.v4 },
        modelId: { type: 'string', pattern: uuid.v4 },
        modelType: { type: 'string' },
        action: { type: 'string' },
        state: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], formate: 'date-time' }
      }
    };
  }
}

module.exports = Changelog;
