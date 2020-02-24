
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.boolean('is_legacy_conversion').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('is_legacy_conversion');
  });
};
