
export function up(knex) {
  return knex.schema.table('project_versions', table => {
    table.index('project_id');
  });
}

export function down(knex) {
  return knex.schema.table('project_versions', table => {
    table.dropIndex('project_id');
  });
}
