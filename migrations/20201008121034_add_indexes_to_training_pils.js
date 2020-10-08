
exports.up = function(knex) {
  return knex.schema.table('training_pils', table => {
    table.index('training_course_id');
    table.index('profile_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('training_pils', table => {
    table.dropIndex('training_course_id');
    table.dropIndex('profile_id');
  });
};
