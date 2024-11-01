
export function up(knex, Promise) {
  return knex.schema.table('exemptions', table => {
    table.jsonb('species');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('exemptions', table => {
    table.dropColumn('species');
  });
}
