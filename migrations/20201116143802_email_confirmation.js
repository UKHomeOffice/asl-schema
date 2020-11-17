
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    table.boolean('email_confirmed').defaultsTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('email_confirmed');
  });
};
