const { uniq, flatten } = require('lodash');
const { UUID, UUIDV1, STRING, ARRAY, TEXT, DATE, fn } = require('sequelize');
const QueryBuilder = require('../lib/query-builder');

module.exports = db => {

  const Place = db.define('place', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    site: STRING,
    area: STRING,
    name: STRING,
    suitability: ARRAY(STRING),
    holding: ARRAY(STRING),
    notes: TEXT,
    deleted: DATE
  }, {
    defaultScope: {
      where: {
        deleted: null
      }
    },
    scopes: {
      all: {
        where: {}
      }
    }
  });

  Place.prototype.softDelete = function () {
    return this.update({ deleted: fn('NOW') });
  };

  Place.getFilterOptions = options => {
    return Promise.all(
      ['site', 'suitability', 'holding'].map(filter =>
        Place.aggregate(filter, 'DISTINCT', {
          ...options,
          plain: false
        })
          .then(result => ({
            key: filter,
            values: uniq(flatten(result.map(r => r.DISTINCT)))
          }))
      )
    )
      .then(filters => filters);
  };

  Place.query = () => {
    return new QueryBuilder(Place);
  };

  return Place;
};
