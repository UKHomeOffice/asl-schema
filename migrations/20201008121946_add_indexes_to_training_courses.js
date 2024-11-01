
export function up(knex) {
  return knex.schema.table('training_courses', table => {
    table.index('establishment_id');
    table.index('project_id');
  });
}

export function down(knex) {
  return knex.schema.table('training_courses', table => {
    table.dropIndex('establishment_id');
    table.dropIndex('project_id');
  });
}
