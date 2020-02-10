
exports.up = function(knex) {
  return knex.schema.table('establishments', table => {
    table.jsonb('billing').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('billing');
  });
};
