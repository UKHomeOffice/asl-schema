import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import EnforcementSubject from './enforcement-subject.js';

const { uuid } = regex;
class EnforcementCase extends BaseModel {

  static get tableName() {
    return 'enforcementCases';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        caseNumber: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      subjects: {
        relation: this.HasManyRelation,
        modelClass: EnforcementSubject,
        join: {
          from: 'enforcementCases.id',
          to: 'enforcementSubjects.caseId'
        }
      }
    };
  }

  static count() {
    return this.query()
      .countDistinct('enforcementCases.id')
      .then(results => results[0].count);
  }

}

export default EnforcementCase;
