const establishments = require('./tables/establishments');
const profiles = require('./tables/profiles');
const permissions = require('./tables/permissions');
const roles = require('./tables/roles');
const places = require('./tables/places');
const projects = require('./tables/projects');

exports.seed = knex => {
  return Promise.resolve()
    .then(() => projects.delete(knex))
    .then(() => places.delete(knex))
    .then(() => permissions.delete(knex))
    .then(() => roles.delete(knex))
    .then(() => profiles.delete(knex))
    .then(() => establishments.delete(knex))
    .then(() => establishments.populate(knex))
    .then(() => profiles.populate(knex))
    .then(() => roles.populate(knex))
    .then(() => permissions.populate(knex))
    .then(() => places.populate(knex))
    .then(() => projects.populate(knex));
};
