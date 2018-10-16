const Knex = require('knex');
const Schema = require('../../../');
const BaseModel = require('../../../schema/base-model');
const settings = require('../../../knexfile').test;

const tables = [
  'Changelog',
  'Project',
  'Permission',
  'Invitation',
  'Authorisation',
  'PIL',
  'Place',
  'Role',
  'TrainingModule',
  'Profile',
  'Establishment'
];

module.exports = {
  init: () => {
    BaseModel.knex(Knex(settings));
    return Schema(settings.connection);
  },
  clean: schema => {
    return tables.reduce((p, table) => {
      return p.then(() => schema[table].queryWithDeleted().hardDelete());
    }, Promise.resolve());
  }
};
