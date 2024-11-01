import BaseModel from './base-model.js';
import uuid from '../lib/regex-validation.js';

const projectVersionStatuses = [
  'draft',
  'granted',
  'submitted'
];

class RetrospectiveAssessment extends BaseModel {
  static get tableName() {
    return 'retrospectiveAssessments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        data: { type: ['object', 'null'] },
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
          from: 'retrospectiveAssessments.projectId',
          to: 'projects.id'
        }
      }
    };
  }

}

export default RetrospectiveAssessment;
