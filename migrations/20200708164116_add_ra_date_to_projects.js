
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.dateTime('ra_date').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('ra_date');
  });
};
