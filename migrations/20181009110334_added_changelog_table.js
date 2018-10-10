
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('changelog')
    .createTable('changelog', table => {
      table.uuid('message_id').primary().notNull();
      table.uuid('changed_by').references('id').inTable('profiles').notNull();
      table.integer('establishment_id').references('id').inTable('establishments');
      table.uuid('model_id').notNull();
      table.string('model_type').notNull();
      table.string('action').notNull();
      table.jsonb('state').notNull();
      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('changelog');
};
