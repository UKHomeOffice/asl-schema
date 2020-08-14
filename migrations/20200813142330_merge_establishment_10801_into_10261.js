const { merge, revertMerge } = require('../lib/merge-establishments');

const fromEstablishmentId = 10801;
const toEstablishmentId = 10261;

exports.up = function(knex) {
  return knex.transaction(trx => merge(trx, fromEstablishmentId, toEstablishmentId));
};

exports.down = function(knex) {
  return knex.transaction(trx => revertMerge(trx, fromEstablishmentId, toEstablishmentId));
};
