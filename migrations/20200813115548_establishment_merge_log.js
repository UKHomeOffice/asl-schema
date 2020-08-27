
exports.up = function(knex) {
  return knex.schema.createTable('establishment_merge_log', table => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('model_type').notNull();
    table.uuid('model_id').notNull();
    table.integer('from_establishment_id').references('id').inTable('establishments').notNull();
    table.integer('to_establishment_id').references('id').inTable('establishments').notNull();
    table.timestamps(false, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('establishment_merge_log');
};
