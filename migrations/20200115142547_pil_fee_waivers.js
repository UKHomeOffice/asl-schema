
exports.up = function(knex) {
  return knex.schema
    .createTable('fee_waivers', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

      table.integer('year').notNull();
      table.index('year');

      table.uuid('pil_id').references('id').inTable('pils').notNull();
      table.index('pil_id');

      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.index('establishment_id');

      table.text('comment');
      table.uuid('profile_id').references('id').inTable('profiles').notNull();

      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('fee_waivers');
};
