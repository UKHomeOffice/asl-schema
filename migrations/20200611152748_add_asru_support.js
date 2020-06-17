
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    table.boolean('asru_support').defaultsTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('asru_support');
  });
};
