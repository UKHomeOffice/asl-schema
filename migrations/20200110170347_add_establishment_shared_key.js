
export function up(knex, Promise) {
  return knex.schema.table('establishments', table => table.string('shared_key'));
}

export function down(knex, Promise) {
  return knex.schema.table('establishments', table => table.dropColumn('shared_key'));
}
