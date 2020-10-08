
exports.up = function(knex) {
  return knex.schema.table('roles', table => {
    table.index('profile_id');
    table.index('establishment_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('roles', table => {
    table.index('profile_id');
    table.index('establishment_id');
  });
};
