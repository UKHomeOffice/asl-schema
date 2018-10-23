
exports.up = function(knex, Promise) {
  return knex.schema.table('pils', table => table.dropColumn('submitted_at'));
};

exports.down = function(knex, Promise) {
  return knex.schema.table('pils', table => table.dateTime('submitted_at'));
};
