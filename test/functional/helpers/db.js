const Schema = require('../../../');
const settings = require('../../../knexfile').test;

const snakeCase = str => str.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`);

module.exports = {
  init: () => Schema(settings.connection),
  clean: schema => {
    return Object.keys(schema).reduce((p, table) => {
      return p.then(() => {
        if (schema[table].tableName) {
          return schema[table].knex().raw(`truncate ${snakeCase(schema[table].tableName)} cascade;`);
        }
      });
    }, Promise.resolve());
  }
};
