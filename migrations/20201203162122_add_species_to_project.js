
export function up(knex) {
  return knex.schema.table('projects', table => {
    table.jsonb('species').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('species');
  });
}
