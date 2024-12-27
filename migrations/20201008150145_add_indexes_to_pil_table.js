
export function up(knex) {
  return knex.schema.table('pils', table => {
    table.index('establishment_id');
    table.index('profile_id');
  });
}

export function down(knex) {
  return knex.schema.table('pils', table => {
    table.dropIndex('establishment_id');
    table.dropIndex('profile_id');
  });
}
