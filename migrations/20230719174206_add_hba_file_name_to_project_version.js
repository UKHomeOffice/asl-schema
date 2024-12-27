export function up(knex) {
  return knex.schema.table('project_versions', (table) => {
    table.string('hba_filename').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('project_versions', (table) => {
    table.dropColumn('hba_filename');
  });
}
