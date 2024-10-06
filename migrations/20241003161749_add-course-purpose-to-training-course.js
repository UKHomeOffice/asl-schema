
exports.up = function(knex) {
  return knex.schema.table('training_courses', (table) => {
    table.string('course_purpose');
  });
};

exports.down = function(knex) {
  return knex.schema.table('training_courses', (table) => {
    table.dropColumn('course_purpose');
  });
};
