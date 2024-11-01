
export function up(knex, Promise) {
  return knex.schema.table('pils', table => table.dropColumn('submitted_at'));
}

export function down(knex, Promise) {
  return knex.schema.table('pils', table => table.dateTime('submitted_at'));
}
