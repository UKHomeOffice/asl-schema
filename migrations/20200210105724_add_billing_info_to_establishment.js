
export function up(knex, Promise) {
  return knex.schema.table('establishments', table => {
    table.jsonb('billing').nullable();
  });
}

export function down(knex, Promise) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('billing');
  });
}
