
export function up(knex) {
  return knex.schema.table('changelog', table => {
    table.index('model_type');
    table.index('model_id');
    table.index('action');
  });
}

export function down(knex) {
  return knex.schema.table('changelog', table => {
    table.dropIndex('action');
    table.dropIndex('model_id');
    table.dropIndex('model_type');
  });
}
