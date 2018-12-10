const { uniq, flatten } = require('lodash');
const BaseModel = require('./base-model');
const { suitabilityCodes, holdingCodes } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

class Place extends BaseModel {
  static get tableName() {
    return 'places';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['site', 'name', 'suitability', 'holding', 'establishmentId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migratedId: { type: ['string', 'null'] },
        site: { type: 'string' },
        area: { type: ['string', 'null'] },
        name: { type: 'string' },
        suitability: {
          type: 'array',
          items: {
            type: 'string',
            enum: suitabilityCodes
          }
        },
        holding: {
          type: 'array',
          items: {
            type: 'string',
            enum: holdingCodes
          }
        },
        restrictions: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        nacwoId: { type: ['string', 'null'] },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static getFilterOptions(establishmentId) {
    return Promise.all(
      ['site', 'suitability', 'holding'].map(filter =>
        this.query()
          .where({ establishmentId })
          .distinct(filter)
          .then(result => ({
            key: filter,
            values: uniq(flatten(result.map(r => r[filter])))
          }))
      )
    )
      .then(filters => filters);
  }

  static filter({ establishmentId, filters = {}, sort = {}, limit, offset }) {

    let query = this.query()
      .distinct('places.*', 'nacwo.lastName')
      .leftJoinRelation('nacwo')
      .where({ 'places.establishmentId': establishmentId })
      .eager('nacwo');

    if (filters.site) {
      query.andWhere('site', 'in', filters.site);
    }

    if (filters.suitability) {
      query.whereJsonSupersetOf('suitability', filters.suitability);
    }

    if (filters.holding) {
      query.whereJsonSupersetOf('holding', filters.holding);
    }

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('site')
        .orderBy('area')
        .orderBy('name');
    }

    query = this.paginate({ query, limit, offset });

    return query;
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'places.establishmentId',
          to: 'establishments.id'
        }
      },
      nacwo: {
        relation: this.HasOneThroughRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'places.nacwoId',
          through: {
            modelClass: `${__dirname}/role`,
            from: 'roles.id',
            to: 'roles.profileId'
          },
          to: 'profiles.id'
        }
      }
    };
  }
}

module.exports = Place;
