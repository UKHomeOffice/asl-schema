
export function up(knex, Promise) {
  return knex.schema.table('projects', table => table.dateTime('amended_date'));
}

export function down(knex, Promise) {
  return knex.schema.table('projects', table => table.dropColumn('amended_date'));
}
