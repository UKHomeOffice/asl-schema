const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

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
        modelClass: `${__dirname}/enforcement-case`,
        join: {
          from: 'enforcementSubjects.caseId',
          to: 'enforcementCases.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'enforcementSubjects.establishmentId',
          to: 'establishments.id'
        }
      },
      profile: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'enforcementSubjects.profileId',
          to: 'profiles.id'
        }
      },
      flags: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/enforcement-flag`,
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

module.exports = EnforcementSubject;
