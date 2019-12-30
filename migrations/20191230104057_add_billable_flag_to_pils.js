
exports.up = function(knex) {
  return knex.schema
    .table('pils', table => { table.boolean('billable').defaultTo(true) });
};

exports.down = function(knex) {
  return knex.schema
    .table('pils', table => { table.dropColumn('billable') });
};
