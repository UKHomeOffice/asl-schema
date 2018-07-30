const { uniq, flatten } = require('lodash');
const { Model, ref } = require('objection');

class Place extends Model {
  static get tableName() {
    return 'places';
  }

  static count(establishmentId) {
    return this.query()
      .where({ establishmentId })
      .count()
      .then(result => result[0].count);
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
    .then(filters => filters)
  }

  static filter({ establishmentId, filters = {}, sort = {} }) {

    const query = this.query()
      .where({ establishmentId })

    if (filters.site) {
      query.andWhere('site', 'in', filters.site)
    }

    query.eager('nacwo.profile')

    if (filters.suitability) {
      query.whereJsonSupersetOf('suitability', filters.suitability)
    }

    if (filters.holding) {
      query.whereJsonSupersetOf('holding', filters.holding)
    }

    if (sort) {
      query.orderBy(sort.column, sort.ascending === 'true' ? 'ASC' : 'DESC')
    } else {
      query.orderBy('site')
        .orderBy('area')
        .orderBy('name')
    }


    return query;
  }

  static get relationMappings() {
    return {
      establishment: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'places.establishmentId',
          to: 'establishments.id'
        }
      },
      nacwo: {
        relation: Model.BelongsToOneRelation,
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
