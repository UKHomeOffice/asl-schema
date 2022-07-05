
exports.up = function(knex) {
  return knex.schema
    .createTable('attachments', table => {
      table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('mimetype').notNull();
      table.string('filename').notNull();
      table.string('token').notNull();
      table.index('token');
      table.dateTime('deleted');
      table.timestamps(false, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('attachments');
};
