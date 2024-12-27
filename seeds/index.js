import establishments from './tables/establishments.js';
import profiles from './tables/profiles.js';
import places from './tables/places.js';
import projects from './tables/projects.js';
import projectVersions from './tables/project-versions.js';
import additionalAvailability from './tables/additional-availability.js';
import trainingCourses from './tables/training-courses.js';
import rops from './tables/rops.js';
import dataExports from './tables/exports.js';
import enforcementCases from './tables/enforcement-cases.js';

export async function seed(knex) {
  const tables = await knex.select('table_name')
    .from('information_schema.tables')
    .whereRaw('table_schema = current_schema()')
    .where('table_catalog', knex.client.database())
    .then(results => results.map(r => r.tableName).filter(tableName => !tableName.includes('knex_')));

  await Promise.all(tables.map(table => knex.raw(`TRUNCATE TABLE ${table} CASCADE`)));
  console.log('DB truncated successfully!!!');

  await establishments.populate(knex);
  await profiles.populate(knex);
  await places.populate(knex);
  await projects.populate(knex);
  await projectVersions.populate(knex);
  await additionalAvailability.populate(knex);
  await trainingCourses.populate(knex);
  await rops.populate(knex);
  await enforcementCases.populate(knex);
  await dataExports.populate(knex);

  console.log('Done DB SEED successfully!!!');
}
