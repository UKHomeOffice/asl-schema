
exports.up = function(knex, Promise) {
  return knex.schema.table('profiles', table => {
    table.boolean('asru_user').defaultsTo(false);
    table.boolean('asru_admin').defaultsTo(false);
    table.boolean('asru_licensing').defaultsTo(false);
    table.boolean('asru_inspector').defaultsTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('asru_user');
    table.dropColumn('asru_admin');
    table.dropColumn('asru_licensing');
    table.dropColumn('asru_inspector');
  })
};
