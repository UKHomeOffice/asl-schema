exports.up = function(knex) {
  return knex.schema
    .table('training_courses', (table) => {
      table.string('course_purpose');
    })
    .table('training_pils', (table) => {
      table.string('organisation');
      table.string('qualification_level_and_subject');
      table.string('applicant_learning_use');
      table.string('job_title_or_qualification');
      table.string('field_of_expertise');
      table.string('applicant_training_use_at_work');
      table.string('other_notes');
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('training_courses', (table) => {
      table.dropColumn('course_purpose');
    })
    .table('training_pils', (table) => {
      table.dropColumn('organisation');
      table.dropColumn('qualification_level_and_subject');
      table.dropColumn('applicant_learning_use');
      table.dropColumn('job_title_or_qualification');
      table.dropColumn('field_of_expertise');
      table.dropColumn('applicant_training_use_at_work');
      table.dropColumn('other_notes');
    });
};
