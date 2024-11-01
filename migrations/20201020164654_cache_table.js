
export function up(knex) {
  return knex.schema
    .createTable('document_cache', table => {
      table.string('id').primary();
      table.jsonb('document');
      table.timestamps(false, true);
    });
}

export function down(knex) {
  knex.schema.dropTable('document_cache');
}
