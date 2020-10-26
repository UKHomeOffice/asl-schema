
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    table.string('rcvs_number');
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('rcvs_number');
  });
};
