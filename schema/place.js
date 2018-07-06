const { UUID, UUIDV1, STRING, ARRAY, TEXT, DATE, fn } = require('sequelize');

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

  return Place;

};
