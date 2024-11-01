
export function up(knex, Promise) {
  return knex.schema.table('pils', table => {
    table.jsonb('species');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('pils', table => {
    table.dropColumn('species');
  });
}
