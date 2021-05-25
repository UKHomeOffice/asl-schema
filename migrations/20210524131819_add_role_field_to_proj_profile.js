
exports.up = function(knex) {
  return knex.schema.table('project_profiles', table => {
    table.enum('role', ['basic', 'edit']).defaultTo('basic');
  });
};

exports.down = function(knex) {
  return knex.schema.table('project_profiles', table => {
    table.dropColumn('role');
  });
};
