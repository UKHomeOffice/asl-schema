
exports.up = function(knex) {
  return knex.schema
    .createTable('document_cache', table => {
      table.string('id').primary();
      table.jsonb('document');
      table.timestamps(false, true);
    });
};

exports.down = function(knex) {
  knex.schema.dropTable('document_cache');
};
