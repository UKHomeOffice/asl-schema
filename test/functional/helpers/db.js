import knex from 'knex';
import Schema from '../../../schema/index.js';
import {test} from '../../../knexfile.js';

// Utility function to convert CamelCase to snake_case
const toSnakeCase = (str) => str.replace(/[A-Z]/g, (s) => `_${s.toLowerCase()}`);

const init = () => {
  return Schema(test.connection);
};

const clean = async (schema) => {
  const knexInstance = knex(test);
  for (const table of Object.keys(schema)) {
    if (schema[table] && schema[table].tableName) {
      const tableName = toSnakeCase(schema[table].tableName);
      try {
        await knexInstance.client.raw(`TRUNCATE ${tableName} CASCADE;`);
      } catch (error) {
        console.error(`Error truncating table ${tableName}:`, error);
      }
    } else {
      console.error(`Table definition missing for: ${table}`);
    }
  }
  console.log('Tables truncated successfully');
};

const latestMigration = async () => {
  const knexInstance = knex(test);
  try {
    await knexInstance.migrate.latest();
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    // Destroy the Knex instance to free up connections
    await knexInstance.destroy();
  }
};

export default {init, clean, latestMigration};
