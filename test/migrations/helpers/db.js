import Knex from 'knex';
import {test as settings} from '../../../knexfile.js';

const tables = [
  'changelog',
  'training_pils',
  'training_courses',
  'asru_establishment',
  'place_roles',
  'procedures',
  'rops',
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

export default {
  init: () => Knex(settings),
  clean: knex => {
    return tables.reduce((p, table) => {
      return p.then(() => knex(table).delete());
    }, Promise.resolve());
  }
};
