const { UUID, UUIDV1, STRING, ARRAY, TEXT } = require('sequelize');

module.exports = db => {

  const Place = db.define('place', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    site: STRING,
    area: STRING,
    name: STRING,
    suitability: ARRAY(STRING),
    holding: ARRAY(STRING),
    notes: TEXT
  });

  return Place;

};
