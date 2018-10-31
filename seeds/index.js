const establishments = require('./tables/establishments');
const profiles = require('./tables/profiles');
const places = require('./tables/places');
const projects = require('./tables/projects');

exports.seed = knex => {
  return Promise.resolve()
    .then(() => knex => knex('changelog').del())
    .then(() => projects.delete(knex))
    .then(() => places.delete(knex))
    .then(() => knex('certificates').del())
    .then(() => knex('exemptions').del())
    .then(() => profiles.delete(knex))
    .then(() => establishments.delete(knex))

    .then(() => establishments.populate(knex))
    .then(() => profiles.populate(knex))
    .then(() => places.populate(knex))
    .then(() => projects.populate(knex))
    .then(() => projects.populateList(knex));
};
