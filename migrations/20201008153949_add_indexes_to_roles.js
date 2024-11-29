
export function up(knex) {
  return knex.schema.table('roles', table => {
    table.index('profile_id');
    table.index('establishment_id');
  });
}

export function down(knex) {
  return knex.schema.table('roles', table => {
    table.dropIndex('profile_id');
    table.dropIndex('establishment_id');
  });
}
