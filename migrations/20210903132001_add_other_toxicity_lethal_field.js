
exports.up = function(knex) {
  return knex.schema.table('rops', table => {
    table.jsonb('regulatory_subpurposes_other_toxicity_lethal').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('rops', table => {
    table.dropColumn('regulatory_subpurposes_other_toxicity_lethal');
  });
};
