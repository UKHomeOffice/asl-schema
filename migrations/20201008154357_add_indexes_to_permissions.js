
exports.up = function(knex) {
  return knex.schema.table('permissions', table => {
    table.index('establishment_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('permissions', table => {
    table.dropIndex('establishment_id');
  });
};
