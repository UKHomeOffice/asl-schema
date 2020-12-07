
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.jsonb('species').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('species');
  });
};
