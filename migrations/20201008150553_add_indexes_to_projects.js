
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.index('licence_holder_id');
    table.index('establishment_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropIndex('licence_holder_id');
    table.dropIndex('establishment_id');
  });
};
