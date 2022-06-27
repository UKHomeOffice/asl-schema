
exports.up = function(knex) {
  return knex.schema
    .createTable('reminders', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.date('deadline').notNull();
      table.string('model_type').notNull();
      table.string('model_id'); // null when model_type === 'establishment'
      table.index('model_id');
      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.index('establishment_id');
      table.string('condition_key');
      table.enum('status', ['pending', 'active']).defaultsTo('pending').notNull();
      table.timestamps(false, true);
      table.dateTime('deleted');
    })
    .createTable('reminder_dismissed', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('reminder_id').references('id').inTable('reminders').notNull();
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.index(['reminder_id', 'profile_id']);
      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('reminder_dismissed')
    .dropTable('reminders');
};
