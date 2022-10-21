
exports.up = function(knex) {
  return knex.schema.createTable('profile_merge_log', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('from_profile_id').references('id').inTable('profiles').notNull();
    table.index('from_profile_id');
    table.uuid('to_profile_id').references('id').inTable('profiles').notNull();
    table.index('to_profile_id');
    table.timestamps(false, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('profile_merge_log');
};
