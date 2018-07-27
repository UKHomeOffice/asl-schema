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

  static filter({ establishmentId, filters = {} }) {

    const query = this.query()
      .select(ref('suitability').castTo('json'))
      .where({ establishmentId })
      .orderBy('site')
      .orderBy('area')
      .orderBy('name')

    if (filters.site) {
      query.andWhere('site', 'in', filters.site)
    }

    // if (filters.suitability) {
    //   console.log(filters.suitability)
    //   query.whereJsonSupersetOf(ref('suitability').castJson(), filters.suitability)
    //   .debug()
    // }
    //
    // if (filters.holding) {
    //   query.andWhere('holding', 'contains', filters.holding)
    // }

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
