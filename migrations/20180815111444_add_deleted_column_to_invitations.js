
exports.up = function(knex, Promise) {
  return knex.schema.table('invitations', table => table.dateTime('deleted'))
};

exports.down = function(knex, Promise) {
  return knex.schema.table('invitations', table => table.dropColumn('deleted'))
};
