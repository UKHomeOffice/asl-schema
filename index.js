const { Model } = require('objection');
const Knex = require('knex');

const Schema = require('./schema');

module.exports = connection => {

  if (connection.username && !connection.user) {
    connection.user = connection.username;
  }

  const settings = {
    client: 'pg',
    useNullAsDefault: true,
    connection
  };

  const knex = Knex(settings);
  Model.knex(knex);

  return {
    ...Schema,
    destroy: cb => knex.destroy(cb)
  };
};
