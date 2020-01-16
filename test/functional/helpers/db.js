const Schema = require('../../../');
const settings = require('../../../knexfile').test;

const tables = [
  'Changelog',
  'ProjectVersion',
  'Project',
  'Permission',
  'Invitation',
  'Authorisation',
  'FeeWaiver',
  'PilTransfer',
  'PIL',
  'Place',
  'Role',
  'Certificate',
  'Exemption',
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
