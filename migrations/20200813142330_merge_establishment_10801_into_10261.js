import {merge, revertMerge} from '../lib/merge-establishments.js';

const fromEstablishmentId = 10801;
const toEstablishmentId = 10261;

export function up(knex) {
  return merge(knex, fromEstablishmentId, toEstablishmentId);
}

export function down(knex) {
  return revertMerge(knex, fromEstablishmentId, toEstablishmentId);
}
