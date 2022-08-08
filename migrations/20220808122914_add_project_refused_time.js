
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.dateTime('refused_date').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('refused_date');
  });
};
