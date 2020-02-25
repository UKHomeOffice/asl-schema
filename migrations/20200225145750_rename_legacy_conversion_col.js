
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.renameColumn('is_legacy_conversion', 'is_legacy_stub');
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.renameColumn('is_legacy_stub', 'is_legacy_conversion');
  });
};
