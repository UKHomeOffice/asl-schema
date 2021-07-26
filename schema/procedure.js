const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

class Procedure extends BaseModel {
  static get tableName() {
    return 'procedures';
  }

  static get editableFields() {
    return [
      'species',
      'reuse',
      'placesOfBirth',
      'nhpsOrigin',
      'nhpsColonyStatus',
      'nhpsGeneration',
      'ga',
      'specialTechniqueUsed',
      'specialTechnique',
      'purposes',
      'newGeneticLine',
      'basicSubpurposes',
      'regulatorySubpurposes',
      'regulatoryLegislation',
      'regulatoryLegislationOrigin',
      'translationalSubpurposes',
      'subpurposeOther',
      'legislationOther',
      'severity',
      'severityNum',
      'severityHoNote',
      'severityPersonalNote'
    ];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['ropId', 'species', 'ga', 'purposes', 'newGeneticLine', 'severity', 'severityNum'],
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        ropId: { type: 'string', pattern: uuid.v4 },
        species: { type: 'string' },
        reuse: { type: ['boolean', 'null'] },
        placesOfBirth: { type: ['string', 'null'] },
        nhpsOrigin: { type: ['string', 'null'] },
        nhpsColonyStatus: { type: ['string', 'null'] },
        nhpsGeneration: { type: ['string', 'null'] },
        ga: { type: 'string' },
        specialTechnique: { type: ['string', 'null'] },
        specialTechniqueUsed: { type: ['boolean', 'null'] },
        purposes: { type: 'string' },
        newGeneticLine: { type: 'boolean' },
        basicSubpurposes: { type: ['string', 'null'] },
        regulatorySubpurposes: { type: ['string', 'null'] },
        regulatoryLegislation: { type: ['string', 'null'] },
        regulatoryLegislationOrigin: { type: ['string', 'null'] },
        translationalSubpurposes: { type: ['string', 'null'] },
        subpurposeOther: { type: ['string', 'null'] },
        legislationOther: { type: ['string', 'null'] },
        severity: { type: 'string' },
        severityNum: { type: 'integer' },
        severityHoNote: { type: ['string', 'null'] },
        severityPersonalNote: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      rop: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/rop`,
        join: {
          from: 'procedures.ropId',
          to: 'rops.id'
        }
      }
    };
  }

  static count(ropId) {
    return this.query()
      .where({ ropId })
      .countDistinct('id')
      .then(results => results[0].count);
  }

  static list({ ropId, sort = {}, limit, offset }) {

    let query = this.query()
      .where({ ropId });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('createdAt', 'asc');
    }

    query = this.paginate({ query, limit, offset });

    return query;
  }

}

module.exports = Procedure;
