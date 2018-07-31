const { Model } = require('objection');
const Knex = require('knex');

const Schema = require('./schema');

module.exports = settings => {
  const defaults = {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      host: 'localhost',
      database: 'asl-test'
    }
  };

  settings = Object.assign(defaults, settings);

  const knex = Knex(settings);
  Model.knex(knex);

  return {
    ...Schema,
    knex
  };
};
