
exports.up = function(knex, Promise) {
  return knex.schema.table('exemptions', table => {
    table.jsonb('species');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('exemptions', table => {
    table.dropColumn('species');
  });
};
