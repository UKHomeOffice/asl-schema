const establishments = require('./tables/establishments');
const profiles = require('./tables/profiles');
const places = require('./tables/places');
const projects = require('./tables/projects');
const projectVersions = require('./tables/project-versions');
const additionalAvailability = require('./tables/additional-availability');
const trainingCourses = require('./tables/training-courses');
const rops = require('./tables/rops');

exports.seed = knex => {
  return Promise.resolve()
    .then(() => knex('establishment_merge_log').del())
    .then(() => knex('document_cache').del())
    .then(() => knex('changelog').del())
    .then(() => knex('training_pils').del())
    .then(() => knex('training_courses').del())
    .then(() => knex('project_profiles').del())
    .then(() => knex('retrospective_assessments').del())
    .then(() => knex('procedures').del())
    .then(() => rops.delete(knex))
    .then(() => additionalAvailability.delete(knex))
    .then(() => projectVersions.delete(knex))
    .then(() => projects.delete(knex))
    .then(() => knex('place_roles').del())
    .then(() => places.delete(knex))
    .then(() => knex('certificates').del())
    .then(() => knex('exemptions').del())
    .then(() => knex('email_preferences').del())
    .then(() => profiles.delete(knex))
    .then(() => knex('authorisations').del())
    .then(() => establishments.delete(knex))

    .then(() => establishments.populate(knex))
    .then(() => profiles.populate(knex))
    .then(() => places.populate(knex))
    .then(() => projects.populate(knex))
    .then(() => projectVersions.populate(knex))
    .then(() => additionalAvailability.populate(knex))
    .then(() => trainingCourses.populate(knex))
    .then(() => rops.populate(knex));
};
