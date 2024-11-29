import BaseModel from './base-model.js';
import regex from '../lib/regex-validation.js';
import EnforcementFlag from './enforcement-flag.js';
import Profile from './profile.js';
import Establishment from './establishment.js';
import EnforcementCase from './enforcement-case.js';

const { uuid } = regex;
class EnforcementSubject extends BaseModel {

  static get tableName() {
    return 'enforcementSubjects';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        caseId: { type: 'string', pattern: uuid.v4 },
        establishmentId: { type: 'integer' },
        profileId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      enforcementCase: {
        relation: this.BelongsToOneRelation,
        modelClass: EnforcementCase,
        join: {
          from: 'enforcementSubjects.caseId',
          to: 'enforcementCases.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: Establishment,
        join: {
          from: 'enforcementSubjects.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'enforcementSubjects.profileId',
          to: 'profiles.id'
        }
      },
      flags: {
        relation: this.HasManyRelation,
        modelClass: EnforcementFlag,
        join: {
          from: 'enforcementSubjects.id',
          to: 'enforcementFlags.subjectId'
        }
      }
    };
  }

  static count() {
    return this.query()
      .countDistinct('enforcementSubjects.id')
      .then(results => results[0].count);
  }

}

export default EnforcementSubject;
