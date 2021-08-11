
exports.up = function(knex) {
  return knex.schema.table('rops', table => {
    table.jsonb('regulatory_subpurposes_qc_other').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('rops', table => {
    table.dropColumn('regulatory_subpurposes_qc_other');
  });
};
