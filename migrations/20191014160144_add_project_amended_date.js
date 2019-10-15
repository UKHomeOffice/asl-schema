
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', table => table.dateTime('amended_date'));
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', table => table.dropColumn('amended_date'));
};
