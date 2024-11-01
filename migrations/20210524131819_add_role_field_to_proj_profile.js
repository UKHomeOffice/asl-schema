
export function up(knex) {
  return knex.schema.table('project_profiles', table => {
    table.enum('role', ['basic', 'edit']).defaultTo('basic');
  });
}

export function down(knex) {
  return knex.schema.table('project_profiles', table => {
    table.dropColumn('role');
  });
}
