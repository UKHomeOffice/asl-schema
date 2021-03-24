const { knexSnakeCaseMappers, transaction } = require('objection');
const Knex = require('knex');
const Schema = require('./schema');

const types = require('pg').types;
const moment = require('moment');

const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
const DATE_OID = 1082;
const INT4_OID = 23;
const INT8_OID = 20;

const parseFn = val => {
  return val === null ? null : moment(val).toISOString();
};

const dateParseFn = val => {
  return val === null ? null : moment(val).format('YYYY-MM-DD');
};

const intParseFn = val => {
  return val === null ? null : parseInt(val, 10);
};

types.setTypeParser(TIMESTAMPTZ_OID, parseFn);
types.setTypeParser(TIMESTAMP_OID, parseFn);
types.setTypeParser(DATE_OID, dateParseFn);

// WARNING: numbers larger than Number.MAX_SAFE_INTEGER will overflow and give different results
types.setTypeParser(INT4_OID, intParseFn);
types.setTypeParser(INT8_OID, intParseFn);

module.exports = connection => {

  if (connection.username && !connection.user) {
    connection.user = connection.username;
  }

  const settings = {
    client: 'pg',
    useNullAsDefault: true,
    connection,
    pool: { min: 1, max: connection.maxConnections || 5 },
    ...knexSnakeCaseMappers()
  };

  const knex = Knex(settings);

  const schema = Schema(knex);

  return {
    ...schema,
    knex,
    transaction: () => transaction.start(knex),
    destroy: cb => knex.destroy(cb)
  };
};
