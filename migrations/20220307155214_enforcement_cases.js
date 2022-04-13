
exports.up = function(knex) {
  return knex.schema
    .createTable('enforcement_cases', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('case_number').notNull();
      table.timestamps(false, true);
      table.dateTime('deleted');
    })
    .createTable('enforcement_subjects', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('case_id').references('id').inTable('enforcement_cases').notNull();
      table.index('case_id');
      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.index('establishment_id');
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.index('profile_id');
      table.timestamps(false, true);
      table.dateTime('deleted');
    })
    .createTable('enforcement_flags', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('subject_id').references('id').inTable('enforcement_subjects').notNull();
      table.index('subject_id');
      table.string('model_type').notNull();
      table.string('model_id'); // null when model_type === 'establishment'
      table.index('model_id');
      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.index('establishment_id');
      table.jsonb('model_options');
      table.enum('status', ['open', 'closed', 'no-breach']).defaultsTo('open').notNull();
      table.jsonb('remedial_action');
      table.string('remedial_other');
      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('enforcement_flags')
    .dropTable('enforcement_subjects')
    .dropTable('enforcement_cases');
};
