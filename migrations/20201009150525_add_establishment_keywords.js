
exports.up = function(knex) {
  return knex.schema.table('establishments', table => {
    table.jsonb('keywords');
  });
};

exports.down = function(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('keywords');
  });
};
