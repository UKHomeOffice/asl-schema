
exports.up = function(knex) {
  return knex.schema.alterTable('exports', table => {
    table.uuid('profile_id').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('exports', table => {
    table.uuid('profile_id').notNullable().alter();
  });
};
