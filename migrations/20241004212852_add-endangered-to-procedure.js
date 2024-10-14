
exports.up = function(knex) {
  return knex.schema.table('procedures', (table) => {
    table.boolean('endangered').nullable();
    table.string('endangered_details').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('procedures', (table) => {
    table.dropColumn('endangered');
    table.dropColumn('endangered_details');
  });
};
