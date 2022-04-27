
exports.up = function(knex) {
  return knex.schema.alterTable('enforcement_flags', table => {
    table.integer('establishment_id').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('enforcement_flags', table => {
    table.integer('establishment_id').notNullable().alter();
  });
};
