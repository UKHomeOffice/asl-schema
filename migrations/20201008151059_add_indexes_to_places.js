
export function up(knex) {
  return knex.schema.table('places', table => {
    table.index('establishment_id');
  });
}

export function down(knex) {
  return knex.schema.table('places', table => {
    table.dropIndex('establishment_id');
  });
}
