
export function up(knex) {
  return knex.schema.table('permissions', table => {
    table.index('establishment_id');
  });
}

export function down(knex) {
  return knex.schema.table('permissions', table => {
    table.dropIndex('establishment_id');
  });
}
