
exports.up = function(knex, Promise) {
  return knex.schema.table('pils', table => {
    table.jsonb('species');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('pils', table => {
    table.dropColumn('species');
  });
};
