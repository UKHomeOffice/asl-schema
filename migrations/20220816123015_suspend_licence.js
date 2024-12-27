
export async function up(knex) {
  await knex.schema.table('establishments', table => table.dateTime('suspended_date').nullable());
  await knex.schema.table('projects', table => table.dateTime('suspended_date').nullable());
  await knex.schema.table('pils', table => table.dateTime('suspended_date').nullable());
}

export async function down(knex) {
  await knex.schema.table('establishments', table => table.dropColumn('suspended_date'));
  await knex.schema.table('projects', table => table.dropColumn('suspended_date'));
  await knex.schema.table('pils', table => table.dropColumn('suspended_date'));
}
