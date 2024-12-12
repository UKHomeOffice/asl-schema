exports.up = function(knex) {
  return knex.schema
    .alterTable('training_pils', (table) => {
      table.text('organisation').alter();
      table.text('qualification_level_and_subject').alter();
      table.text('applicant_learning_use').alter();
      table.text('job_title_or_qualification').alter();
      table.text('field_of_expertise').alter();
      table.text('applicant_training_use_at_work').alter();
      table.text('other_notes').alter();
    });
};

exports.down = function(knex) {
  // Do nothing.
  //
  // TEXT behaves with the app in the same way as VARCHAR(255) does
  // and, the alter is idempotent if already run, and the drop column in
  // 20241003161749_add-course-purpose-to-training-course.js will work
  // regardless of column type. If left as is we don't truncate/error if users
  // have entered more data and this ends up rolling back.
};
