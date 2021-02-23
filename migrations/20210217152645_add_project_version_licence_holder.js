
exports.up = function(knex) {
  return knex.schema.table('project_versions', table => {
    table.uuid('licence_holder_id').references('id').inTable('profiles');
  });
};

exports.down = function(knex) {
  return knex.schema.table('project_versions', table => {
    table.dropColumn('licence_holder_id');
  });
};
