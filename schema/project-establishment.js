const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

const statuses = [
  'draft',
  'active',
  'removed'
];

class ProjectEstablishment extends BaseModel {
  static get tableName() {
    return 'projectEstablishments';
  }

  static get idColumn() {
    return ['projectId', 'establishmentId'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['establishmentId', 'projectId'],
      additionalProperties: false,
      properties: {
        establishmentId: { type: 'integer' },
        projectId: { type: 'string', pattern: uuid.v4 },
        versionId: { type: ['string', 'null'], pattern: uuid.v4 },
        status: { type: 'string', enum: statuses },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = ProjectEstablishment;
