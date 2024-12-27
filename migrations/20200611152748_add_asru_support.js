
export function up(knex, Promise) {
  return knex.schema.table('profiles', table => {
    table.boolean('asru_support').defaultsTo(false);
  });
}

export function down(knex, Promise) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('asru_support');
  });
}
