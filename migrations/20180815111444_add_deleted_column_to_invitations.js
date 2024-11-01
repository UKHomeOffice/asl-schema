
export function up(knex, Promise) {
  return knex.schema.table('invitations', table => table.dateTime('deleted'));
}

export function down(knex, Promise) {
  return knex.schema.table('invitations', table => table.dropColumn('deleted'));
}
