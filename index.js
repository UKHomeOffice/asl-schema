const Sequelize = require('sequelize');

const Schema = require('./schema');

module.exports = settings => {

  const defaults = { dialect: 'postgres', logging: false, operatorsAliases: false };

  settings = Object.assign(defaults, settings);

  const db = new Sequelize(settings);

  return Schema(db);

}
