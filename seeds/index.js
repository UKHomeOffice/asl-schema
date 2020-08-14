const establishments = require('./tables/establishments');
const profiles = require('./tables/profiles');
const places = require('./tables/places');
const projects = require('./tables/projects');
const projectVersions = require('./tables/project-versions');

exports.seed = knex => {
  return Promise.resolve()
    .then(() => knex('changelog').del())
    .then(() => knex('training_pils').del())
    .then(() => knex('training_courses').del())
    .then(() => knex('project_profiles').del())
    .then(() => projectVersions.delete(knex))
    .then(() => projects.delete(knex))
    .then(() => knex('place_roles').del())
    .then(() => places.delete(knex))
    .then(() => knex('certificates').del())
    .then(() => knex('exemptions').del())
    .then(() => profiles.delete(knex))
    .then(() => knex('authorisations').del())
    .then(() => establishments.delete(knex))

    .then(() => establishments.populate(knex))
    .then(() => profiles.populate(knex))
    .then(() => places.populate(knex))
    .then(() => projects.populate(knex))
    .then(() => projects.populateList(knex))
    .then(() => projectVersions.populate(knex));
};
