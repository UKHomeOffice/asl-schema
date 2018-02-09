const { UUID, UUIDV1, STRING } = require('sequelize');

module.exports = db => {

  const Place = db.define('place', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    name: STRING,
    site: STRING,
    building: STRING,
    floor: STRING
  });

  return Place;

};
