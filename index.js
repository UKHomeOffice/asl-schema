const { Model } = require('objection');
const Knex = require('knex');
const Schema = require('./schema');

const types = require('pg').types;
const moment = require('moment');

const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
const DATE_OID = 1082;

const parseFn = val => {
  return val === null ? null : moment(val).toISOString();
};

types.setTypeParser(TIMESTAMPTZ_OID, parseFn);
types.setTypeParser(TIMESTAMP_OID, parseFn);
types.setTypeParser(DATE_OID, parseFn);

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
