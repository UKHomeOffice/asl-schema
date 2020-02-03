
exports.up = function(knex) {
  return knex.schema.table('project_versions', table => table.bool('asru_version').defaultTo(false));
};

exports.down = function(knex) {
  return knex.schema.table('project_versions', table => table.dropColumn('asru_version'));
};
