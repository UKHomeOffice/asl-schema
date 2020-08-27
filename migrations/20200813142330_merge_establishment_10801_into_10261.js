const { merge, revertMerge } = require('../lib/merge-establishments');

const fromEstablishmentId = 10801;
const toEstablishmentId = 10261;

exports.up = function(knex) {
  return merge(knex, fromEstablishmentId, toEstablishmentId);
};

exports.down = function(knex) {
  return revertMerge(knex, fromEstablishmentId, toEstablishmentId);
};
