const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

const projectVersionStatuses = [
  'draft',
  'granted',
  'submitted'
];

class Rops extends BaseModel {
  static get tableName() {
    return 'rops';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        projectId: { type: 'string', pattern: uuid.v4 },
        status: { type: 'string', enum: projectVersionStatuses },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      project: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/project`,
        join: {
          from: 'rops.projectId',
          to: 'projects.id'
        }
      },
      procedures: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/procedure`,
        join: {
          from: 'rops.id',
          to: 'procedures.ropId'
        }
      }
    };
  }

}

module.exports = RetrospectiveAssessment;
