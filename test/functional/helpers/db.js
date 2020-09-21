const Schema = require('../../../');
const settings = require('../../../knexfile').test;

const tables = [
  'Changelog',
  'TrainingPil',
  'TrainingCourse',
  'AsruEstablishment',
  'ProjectProfile',
  'ProjectVersion',
  'Project',
  'Permission',
  'Invitation',
  'Authorisation',
  'FeeWaiver',
  'PilTransfer',
  'PIL',
  'PlaceRole',
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
