
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('training_pils')
    .createTable('training_pils', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('training_course_id').references('id').inTable('training_courses').notNull();
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.enum('status', ['active', 'pending', 'inactive', 'expired', 'revoked']).defaultsTo('inactive');
      table.text('training_need');
      table.dateTime('deleted');
      table.timestamps(false, true);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('training_pils');
};
