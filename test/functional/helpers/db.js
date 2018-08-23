const Schema = require('../../../');
const settings = require('../../../knexfile').test;

const tables = [
  'Project',
  'Permission',
  'Authorisation',
  'PIL',
  'Place',
  'Role',
  'TrainingModule',
  'Profile',
  'Establishment'
];

module.exports = {
  init: () => Schema(settings.connection),
  clean: schema => {
    return tables.reduce((p, table) => {
      return p.then(() => schema[table].queryWithDeleted().hardDelete());
    }, Promise.resolve());
  }
};
