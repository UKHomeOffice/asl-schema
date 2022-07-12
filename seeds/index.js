const establishments = require('./tables/establishments');
const profiles = require('./tables/profiles');
const places = require('./tables/places');
const projects = require('./tables/projects');
const projectVersions = require('./tables/project-versions');
const additionalAvailability = require('./tables/additional-availability');
const trainingCourses = require('./tables/training-courses');
const rops = require('./tables/rops');
const dataExports = require('./tables/exports');
const enforcementCases = require('./tables/enforcement-cases');

exports.seed = async knex => {
  const tables = await knex.select('table_name')
    .from('information_schema.tables')
    .whereRaw('table_schema = current_schema()')
    .where('table_catalog', knex.client.database())
    .then(results => results.map(r => r.tableName).filter(tableName => !tableName.includes('knex_')));

  await Promise.all(tables.map(table => knex.raw(`TRUNCATE TABLE ${table} CASCADE`)));

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
};
