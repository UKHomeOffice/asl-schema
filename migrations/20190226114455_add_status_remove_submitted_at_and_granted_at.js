
exports.up = function(knex, Promise) {
  return knex.schema.table('project_versions', table => {
    table.dropColumn('granted_at');
    table.dropColumn('submitted_at');
    table.enum('status', ['draft', 'granted', 'submitted', 'withdrawn']).defaultsTo('draft');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('project_versions', table => {
    table.dateTime('granted_at');
    table.dateTime('submitted_at');
    table.dropColumn('status');
  });
};
