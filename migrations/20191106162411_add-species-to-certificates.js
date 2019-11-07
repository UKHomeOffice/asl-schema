
exports.up = function(knex) {
  return knex.schema.table('certificates', table => {
    table.jsonb('species');
  });
};

exports.down = function(knex) {
  return knex.schema.table('certificates', table => {
    table.dropColumn('species');
  });
};
