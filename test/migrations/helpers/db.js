const Schema = require('../../../');
const settings = require('../../../knexfile').test;

const tables = [
  'changelog',
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
  init: () => Schema(settings.connection),
  clean: schema => {
    return tables.reduce((p, table) => {
      return p.then(() => schema.knex(table).delete());
    }, Promise.resolve());
  }
};
