
exports.up = function(knex) {
  return knex.schema.table('places', table => {
    table.index('establishment_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('places', table => {
    table.dropIndex('establishment_id');
  });
};
