
exports.up = function(knex) {
  return knex.schema
    .createTable('exports', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.string('type').notNull();
      table.index('type');
      table.string('key').notNull();
      table.index('key');
      table.boolean('ready').defaultTo(false);
      table.jsonb('meta');
      table.dateTime('deleted');
      table.timestamps(false, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('exports');
};
