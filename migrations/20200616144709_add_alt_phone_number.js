
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    table.string('telephone_alt');
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('telephone_alt');
  });
};
