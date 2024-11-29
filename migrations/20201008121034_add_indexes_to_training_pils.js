
export function up(knex) {
  return knex.schema.table('training_pils', table => {
    table.index('training_course_id');
    table.index('profile_id');
  });
}

export function down(knex) {
  return knex.schema.table('training_pils', table => {
    table.dropIndex('training_course_id');
    table.dropIndex('profile_id');
  });
}
