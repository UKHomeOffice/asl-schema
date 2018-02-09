const { STRING } = require('sequelize');

module.exports = db => {

  const Establishment = db.define('establishment', {
    id: { type: STRING, primaryKey: true },
    name: STRING
  });

  return Establishment;

};
