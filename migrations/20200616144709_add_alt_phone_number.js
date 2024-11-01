
export function up(knex, Promise) {
  return knex.schema.table('profiles', table => {
    table.string('telephone_alt');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('telephone_alt');
  });
}
