export function up(knex) {
  return knex.schema.table('project_versions', (table) => {
    table.string('hba_token').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('project_versions', (table) => {
    table.dropColumn('hba_token');
  });
}
