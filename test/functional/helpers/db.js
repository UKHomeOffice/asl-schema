import knex from 'knex';
import Schema from '../../../schema/index.js';
import {test} from '../../../knexfile.js';

// Utility function to convert CamelCase to snake_case
const toSnakeCase = (str) => str.replace(/[A-Z]/g, (s) => `_${s.toLowerCase()}`);

/**
 * @return Schema - return Schema | ASPeL Schema form dirctory schema.
 * */
const init = () => {
  return Schema(test.connection);
};
/**
 * @return void - truncate on cascade all tables passed in schema.
 * @param schema - Objection Model you have implemented in schema directory.
 * */
const clean = async (schema) => {
  const knexInstance = knex(test);
  await latestMigration();
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
  await knexInstance.destroy();
};

/**
 * @return void - run latest migration.
 * */
const latestMigration = async () => {
  const knexInstance = knex(test);
  try {
    await knexInstance.migrate.latest();
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    // Destroy the Knex instance to free up connections
    await knexInstance.destroy();
  }
};

/**
 * @return knexInstance - knex instance to query DB.
 * @usuage
 *   // ...knexSnakeCaseMappers() is to set the knex query pattern, see ObjectionJs docs for more info.
 *   const { knexInstance: dbInstance } = dbExtra;
 *
 *   const knexInstance = Knex({
 *     ...dbInstance.client.config,
 *     ...knexSnakeCaseMappers()
 *   });
 * */
const knexInstance = knex(test);

export default {init, clean, latestMigration, knexInstance};
