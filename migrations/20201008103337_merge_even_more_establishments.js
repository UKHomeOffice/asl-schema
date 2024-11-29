import {merge, revertMerge} from '../lib/merge-establishments.js';

const fromEstablishmentId = 8211;
const toEstablishmentId = 8271;

export function up(knex) {
  return merge(knex, fromEstablishmentId, toEstablishmentId);
}

export function down(knex) {
  return revertMerge(knex, fromEstablishmentId, toEstablishmentId);
}
