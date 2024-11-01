
export function up(knex) {
  return knex.schema.table('profiles', table => {
    table.dateTime('last_login').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('last_login');
  });
}
