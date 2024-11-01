
export function up(knex, Promise) {
  return knex.schema.table('project_versions', table => table.bool('asru_version').defaultTo(false));
}

export function down(knex, Promise) {
  return knex.schema.table('project_versions', table => table.dropColumn('asru_version'));
}
