
export function up(knex) {
  return knex.schema.table('projects', table => {
    table.index('licence_holder_id');
    table.index('establishment_id');
  });
}

export function down(knex) {
  return knex.schema.table('projects', table => {
    table.dropIndex('licence_holder_id');
    table.dropIndex('establishment_id');
  });
}
