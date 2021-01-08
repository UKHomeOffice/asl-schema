
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.dateTime('ra_granted_date').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.dropColumn('ra_granted_date');
  });
};
