
export function up(knex) {
  return knex.schema.table('establishments', table => {
    table.jsonb('keywords');
  });
}

export function down(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('keywords');
  });
}
