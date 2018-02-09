const Sequelize = require('sequelize');

const Schema = require('./schema');

module.exports = settings => {

  const db = new Sequelize(settings, { logging: false, operatorsAliases: false });

  return Schema(db);

}
