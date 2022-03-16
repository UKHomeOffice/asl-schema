const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

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
      flags: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/enforcement-flag`,
        join: {
          from: 'enforcementCases.id',
          to: 'enforcementFlags.caseId'
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

module.exports = EnforcementCase;
