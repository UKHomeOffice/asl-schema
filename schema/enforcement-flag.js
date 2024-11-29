import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import EnforcementSubject from './enforcement-subject.js';
import Establishment from './establishment.js';
import Profile from './profile.js';
import Pil from './pil.js';
import Project from './project.js';

const statuses = ['open', 'closed'];

const remedialActions = [
  'no-breach',
  'inspector-advice',
  'letter-of-reprimand',
  'reprimand-retraining',
  'compliance-notice',
  'suspension-retraining',
  'licence-revocation',
  'other'
];

const { uuid } = regex;

class EnforcementFlag extends BaseModel {

  static get tableName() {
    return 'enforcementFlags';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        subjectId: { type: 'string', pattern: uuid.v4 },
        profileId: { type: 'string', pattern: uuid.v4 },
        modelType: { type: 'string' },
        modelId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        modelOptions: { type: 'array', items: { type: 'string' } },
        status: { type: 'string', enum: statuses },
        remedialAction: {
          type: 'array',
          items: {
            type: 'string',
            enum: remedialActions
          }
        },
        remedialOther: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      subject: {
        relation: this.BelongsToOneRelation,
        modelClass: EnforcementSubject,
        join: {
          from: 'enforcementFlags.subjectId',
          to: 'enforcementSubjects.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'enforcementFlags.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'enforcementFlags.modelId',
          to: 'profiles.id'
        }
      },
      pil: {
        relation: this.BelongsToOneRelation,
        modelClass: Pil,
        join: {
          from: 'enforcementFlags.modelId',
          to: 'pils.id'
        }
      },
      project: {
        relation: this.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: 'enforcementFlags.modelId',
          to: 'projects.id'
        }
      }
    };
  }

  static count() {
    return this.query()
      .countDistinct('enforcementFlags.id')
      .then(results => results[0].count);
  }

}

export default EnforcementFlag;
