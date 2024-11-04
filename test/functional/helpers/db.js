import knex from 'knex';
import Schema from '../../../schema/index.js';
import {test} from '../../../knexfile.js';

// Utility function to convert CamelCase to snake_case
const toSnakeCase = (str) => str.replace(/[A-Z]/g, (s) => `_${s.toLowerCase()}`);

const init = () => {
  return Schema(test);
};

// Clean function to truncate tables
export const clean = async (schema) => {
  const knexInstance = knex(test); // Create a new Knex instance if not using global one
  for (const table of Object.keys(schema)) {
    if (schema[table] && schema[table].tableName) {
      const tableName = toSnakeCase(schema[table].tableName);
      try {
        const result = await knexInstance.raw(`TRUNCATE ${tableName} CASCADE;`);
        console.log(`Table ${tableName} truncated successfully:`, result);
      } catch (error) {
        console.error(`Error truncating table ${tableName}:`, error);
      }
    } else {
      console.error(`Table definition missing for: ${table}`);
    }
  }
};

export default {init, clean};
