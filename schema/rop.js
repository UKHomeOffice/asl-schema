const BaseModel = require('./base-model');
const { uuid } = require('../lib/regex-validation');

const ropStatuses = [
  'draft',
  'submitted'
];

class Rops extends BaseModel {
  static get tableName() {
    return 'rops';
  }

  static get editableFields() {
    return [
      'proceduresCompleted',
      'postnatal',
      'endangered',
      'endangeredDetails',
      'nmbas',
      'generalAnaesthesia',
      'generalAnaesthesiaDetails',
      'rodenticide',
      'rodenticideDetails',
      'productTesting',
      'productTestingTypes',
      'otherSpecies',
      'species',
      'reuse',
      'placesOfBirth',
      'scheduleTwoDetails',
      'nhpsOrigin',
      'nhpsColonyStatus',
      'nhpsGeneration',
      'ga',
      'purposes',
      'basicSubpurposes',
      'basicSubpurposesOther',
      'regulatorySubpurposes',
      'regulatorySubpurposesOther',
      'regulatorySubpurposesQcOther',
      'regulatorySubpurposesOtherEfficacy',
      'regulatorySubpurposesOtherToxicity',
      'regulatorySubpurposesOtherToxicityEcotoxicity',
      'regulatorySubpurposesOtherToxicityLethal',
      'regulatoryLegislation',
      'regulatoryLegislationOther',
      'regulatoryLegislationOrigin',
      'translationalSubpurposes',
      'translationalSubpurposesOther',
      'newGeneticLine'
    ];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        projectId: { type: 'string', pattern: uuid.v4 },
        status: { type: 'string', enum: ropStatuses },
        year: { type: 'integer' },
        proceduresCompleted: { type: ['boolean', 'null'] },
        postnatal: { type: ['boolean', 'null'] },
        endangered: { type: ['boolean', 'null'] },
        endangeredDetails: { type: ['string', 'null'] },
        nmbas: { type: ['boolean', 'null'] },
        generalAnaesthesia: { type: ['boolean', 'null'] },
        generalAnaesthesiaDetails: { type: ['string', 'null'] },
        rodenticide: { type: ['boolean', 'null'] },
        rodenticideDetails: { type: ['string', 'null'] },
        productTesting: { type: ['boolean', 'null'] },
        productTestingTypes: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        otherSpecies: { type: ['boolean', 'null'] },
        species: { type: ['object', 'null'] },
        nhpsOrigin: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        nhpsColonyStatus: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        nhpsGeneration: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        reuse: { type: ['boolean', 'null'] },
        placesOfBirth: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        scheduleTwoDetails: { type: ['string', 'null'] },
        ga: { type: ['boolean', 'null'] },
        purposes: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        basicSubpurposes: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        basicSubpurposesOther: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatorySubpurposes: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        regulatorySubpurposesOther: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatorySubpurposesQcOther: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatorySubpurposesOtherEfficacy: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatorySubpurposesOtherToxicity: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatorySubpurposesOtherToxicityEcotoxicity: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatorySubpurposesOtherToxicityLethal: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatoryLegislation: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        regulatoryLegislationOther: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        regulatoryLegislationOrigin: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        translationalSubpurposes: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
        translationalSubpurposesOther: {
          type: ['array', 'null'],
          items: { type: 'object' }
        },
        newGeneticLine: { type: ['boolean', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deleted: { type: ['string', 'null'], format: 'date-time' },
        submittedDate: { type: ['string', 'null'], format: 'date-time' }
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

module.exports = Rops;
