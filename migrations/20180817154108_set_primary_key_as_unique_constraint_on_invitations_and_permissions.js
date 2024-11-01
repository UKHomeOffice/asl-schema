
export function up(knex, Promise) {
  return knex.schema.table('invitations', table => table.primary(['profileId', 'establishmentId']))
    .table('permissions', table => table.primary(['profileId', 'establishmentId']));
}

export function down(knex, Promise) {
  return knex.schema.table('permissions', table => table.dropPrimary(['profileId', 'establishmentId']))
    .table('invitations', table => table.dropPrimary(['profileId', 'establishmentId']));
}
