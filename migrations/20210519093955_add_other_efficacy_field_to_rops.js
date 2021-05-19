
exports.up = function(knex) {
  return knex.schema.table('rops', table => {
    table.string('regulatory_subpurposes_other_efficacy');
  });
};

exports.down = function(knex) {
  return knex.schema.table('rops', table => {
    table.dropColumn('regulatory_subpurposes_other_efficacy');
  });
};
