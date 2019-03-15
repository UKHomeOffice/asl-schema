
exports.up = function(knex, Promise) {
  return knex.schema.table('establishments', table => { table.string('company') });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('establishments', table => { table.dropColumn('company') });
};
