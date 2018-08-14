
exports.up = function(knex, Promise) {
  return knex.schema.table('invitations', table => table.unique(['profileId', 'establishmentId']))
    .table('permissions', table => table.unique(['profileId', 'establishmentId']));
};

exports.down = function(knex, Promise) {
  return knex.schema.table('permissions', table => table.dropUnique(['profileId', 'establishmentId']))
    .table('invitations', table => table.dropUnique(['profileId', 'establishmentId']));
};
