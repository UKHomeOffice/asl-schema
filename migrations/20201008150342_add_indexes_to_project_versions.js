
exports.up = function(knex) {
  return knex.schema.table('project_versions', table => {
    table.index('project_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('project_versions', table => {
    table.dropIndex('project_id');
  });
};
