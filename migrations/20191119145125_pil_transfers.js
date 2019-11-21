
exports.up = function(knex) {
  return knex.schema
    .dropTableIfExists('pil_transfers')
    .createTable('pil_transfers', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

      table.uuid('pil_id').references('id').inTable('pils').notNull();
      table.index('pil_id');

      table.integer('from_establishment_id').references('id').inTable('establishments').notNull();
      table.integer('to_establishment_id').references('id').inTable('establishments').notNull();

      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pil_transfers');
};
