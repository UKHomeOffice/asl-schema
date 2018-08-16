const { uniq, flatten } = require('lodash');
const BaseModel = require('./base-model');

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
        id: { type: 'string' },
        'migrated_id': { type: 'string' },
        site: { type: 'string' },
        area: { type: 'string' },
        name: { type: 'string' },
        suitability: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['SA', 'LA', 'AQ', 'AV', 'DOG', 'CAT', 'EQU', 'NHP']
          }
        },
        holding: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['STH', 'LTH', 'NOH', 'SEP', 'NSEP']
          }
        },
        notes: { type: 'string' },
        'created_at': { type: 'string' },
        'updated_at': { type: 'string' },
        establishmentId: { type: 'string' },
        nacwoId: { type: 'string' }
      }
    };
  }

  static getFilterOptions(establishmentId) {
    return Promise.all(
      ['site', 'suitability', 'holding'].map(filter =>
        this.query()
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
      .where({ establishmentId })
      .eager('nacwo.profile');

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
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'places.nacwoId',
          to: 'roles.id'
        }
      }
    };
  }
}

module.exports = Place;
