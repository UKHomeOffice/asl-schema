const establishments = require('./tables/establishments');
const profiles = require('./tables/profiles');
const places = require('./tables/places');
const projects = require('./tables/projects');
const trainingModules = require('./tables/training-modules');

exports.seed = knex => {
  return Promise.resolve()
    .then(() => trainingModules.delete(knex))
    .then(() => projects.delete(knex))
    .then(() => places.delete(knex))
    .then(() => profiles.delete(knex))
    .then(() => establishments.delete(knex))

    .then(() => establishments.populate(knex))
    .then(() => profiles.populate(knex))
    .then(() => places.populate(knex))
    .then(() => projects.populate(knex))
    .then(() => projects.populateList(knex))
    .then(() => trainingModules.populate(knex));
};
