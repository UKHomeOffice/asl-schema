
exports.up = function(knex) {
  return knex.schema
    .createTable('notifications', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.string('to').notNull();
      table.string('name').notNull();
      table.string('subject').notNull();
      table.text('html').notNull();
      table.string('identifier').notNull();
      table.dateTime('completed').nullable();
      table.dateTime('deleted');
      table.timestamps(false, true);
      table.index('identifier');
      table.index('to');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};
