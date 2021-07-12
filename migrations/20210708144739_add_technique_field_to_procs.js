
exports.up = function(knex) {
  return knex.schema.table('procedures', table => {
    table.boolean('special_technique_used').nullable();
    table.string('special_technique').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('procedures', table => {
    table.dropColumn('special_technique_used');
    table.dropColumn('special_technique');
  });
};
