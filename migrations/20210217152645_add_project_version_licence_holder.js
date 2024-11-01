
export function up(knex) {
  return knex.schema.table('project_versions', table => {
    table.uuid('licence_holder_id').references('id').inTable('profiles');
  });
}

export function down(knex) {
  return knex.schema.table('project_versions', table => {
    table.dropColumn('licence_holder_id');
  });
}
