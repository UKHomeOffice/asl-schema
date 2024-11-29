
export function up(knex, Promise) {
  return knex.schema.table('establishments', table => { table.string('company'); });
}

export function down(knex, Promise) {
  return knex.schema.table('establishments', table => { table.dropColumn('company'); });
}
