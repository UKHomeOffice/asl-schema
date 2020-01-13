
exports.up = function(knex) {
  return knex.schema.table('establishments', table => table.string('shared_key'));
};

exports.down = function(knex) {
  return knex.schema.table('establishments', table => table.dropColumn('shared_key'));
};
