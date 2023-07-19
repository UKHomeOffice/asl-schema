exports.up = function (knex) {
  return knex.schema.table('project_versions', (table) => {
    table.string('hba_name').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('project_versions', (table) => {
    table.dropColumn('hba_name');
  });
};
