
exports.up = function(knex) {
  return knex.schema.table('project_versions', table => {
    table.boolean('ra_compulsory').defaultsTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('project_versions', table => {
    table.dropColumn('ra_compulsory');
  });
};
