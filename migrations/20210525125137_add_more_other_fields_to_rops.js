
exports.up = function(knex) {
  return knex.schema.table('rops', table => {
    table.string('regulatory_subpurposes_other_toxicity');
    table.string('regulatory_subpurposes_other_toxicity_ecotoxicity');
  });
};

exports.down = function(knex) {
  return knex.schema.table('rops', table => {
    table.dropColumn('regulatory_subpurposes_other_toxicity');
    table.dropColumn('regulatory_subpurposes_other_toxicity_ecotoxicity');
  });
};
