
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dateTime('last_login').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('last_login');
  });
};
