const Knex = require('knex');
const settings = require('../../../knexfile').test;

const tables = [
  'changelog',
  'place_roles',
  'project_versions',
  'projects',
  'permissions',
  'invitations',
  'authorisations',
  'fee_waivers',
  'pil_transfers',
  'pils',
  'places',
  'roles',
  'certificates',
  'exemptions',
  'profiles',
  'establishments'
];

module.exports = {
  init: () => Knex(settings),
  clean: knex => {
    return tables.reduce((p, table) => {
      return p.then(() => knex(table).delete());
    }, Promise.resolve());
  }
};
