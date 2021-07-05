const Schema = require('../../../');
const settings = require('../../../knexfile').test;

const tables = [
  'Changelog',
  'TrainingPil',
  'TrainingCourse',
  'AsruEstablishment',
  'ProjectEstablishment',
  'Procedure',
  'Rop',
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
      return p.then(() => {
        if (typeof schema[table].queryWithDeleted === 'function') {
          return schema[table].queryWithDeleted().hardDelete();
        }
        return schema[table].query().delete();
      });
    }, Promise.resolve());
  }
};
