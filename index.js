const Sequelize = require('sequelize');

const Schema = require('./schema');

module.exports = db => {

  const sequelize = new Sequelize(db, { logging: false, operatorsAliases: false });

  return Schema(sequelize);

}
