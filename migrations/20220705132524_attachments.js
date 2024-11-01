
export function up(knex) {
  return knex.schema
    .createTable('attachments', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('mimetype').notNull();
      table.string('filename').notNull();
      table.string('token').notNull();
      table.index('token');
      table.dateTime('deleted');
      table.timestamps(false, true);
    });
}

export function down(knex) {
  return knex.schema.dropTable('attachments');
}
