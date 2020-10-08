const { merge, revertMerge } = require('../lib/merge-establishments');

const fromEstablishmentId = 8211;
const toEstablishmentId = 8271;

exports.up = function(knex) {
  return merge(knex, fromEstablishmentId, toEstablishmentId);
};

exports.down = function(knex) {
  return revertMerge(knex, fromEstablishmentId, toEstablishmentId);
};
