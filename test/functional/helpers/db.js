import Schema from '../../../schema/index.js';
import {test} from '../../../knexfile.js';

const settings = test;
// Utility function to convert CamelCase to snake_case
const toSnakeCase = (str) => str.replace(/[A-Z]/g, (s) => `_${s.toLowerCase()}`);

export default {
  init() {
    return Schema(settings.connection);
  },

  clean(schema) {
    return Object.keys(schema).reduce((p, table) => {
      return p.then(() => {
        if (schema[table].tableName) {
          return schema[table].knex().raw(`TRUNCATE ${toSnakeCase(schema[table].tableName)} CASCADE;`);
        }
      });
    }, Promise.resolve());
  }
};
