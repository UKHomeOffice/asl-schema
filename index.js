const { Model } = require('objection');
const Knex = require('knex');

const Schema = require('./schema');

module.exports = connection => {
  const settings = {
    client: 'pg',
    useNullAsDefault: true,
    connection
  };

  const knex = Knex(settings);
  Model.knex(knex);

  return {
    ...Schema,
    knex
  };
};
