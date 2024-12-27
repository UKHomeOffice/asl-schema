
export function up(knex, Promise) {
  return knex.schema.table('certificates', table => {
    table.jsonb('species');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('certificates', table => {
    table.dropColumn('species');
  });
}
