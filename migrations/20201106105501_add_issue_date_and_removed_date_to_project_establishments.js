exports.up = function(knex) {
  return knex.schema.table('project_establishments', table => {
    table.dateTime('issue_date').nullable();
    table.dateTime('revoked_date').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('project_establishments', table => {
    table.dropColumn('issue_date');
    table.dropColumn('revoked_date');
  });
};
