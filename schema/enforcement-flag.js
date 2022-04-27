const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

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
        modelClass: `${__dirname}/enforcement-subject`,
        join: {
          from: 'enforcementFlags.subjectId',
          to: 'enforcementSubjects.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'enforcementFlags.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'enforcementFlags.modelId',
          to: 'profiles.id'
        }
      },
      pil: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/pil`,
        join: {
          from: 'enforcementFlags.modelId',
          to: 'pils.id'
        }
      },
      project: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/project`,
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

module.exports = EnforcementFlag;
