
exports.up = function(knex) {
  return knex.schema.alterTable('changelog', table => {
    table.uuid('changed_by').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('changelog', table => {
    table.uuid('changed_by').notNullable().alter();
  });
};
