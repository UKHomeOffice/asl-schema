
exports.up = function(knex) {
  return knex.schema.alterTable('notifications', table => {
    table.uuid('profile_id').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('notifications', table => {
    table.uuid('profile_id').notNull().alter();
  });
};
