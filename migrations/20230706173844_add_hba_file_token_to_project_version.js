exports.up = function (knex) {
  return knex.schema.table('project_versions', (table) => {
    table.string('hba_token').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('project_versions', (table) => {
    table.dropColumn('hba_token');
  });
};
