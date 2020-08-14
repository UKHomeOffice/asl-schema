
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('training_courses')
    .createTable('training_courses', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.string('title').notNull();
      table.date('start_date').notNull();
      table.jsonb('species');
      table.dateTime('deleted');
      table.timestamps(false, true);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('training_courses');
};
