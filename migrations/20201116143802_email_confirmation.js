
export function up(knex) {
  return knex.schema.table('profiles', table => {
    table.boolean('email_confirmed').defaultsTo(false);
  });
}

export function down(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('email_confirmed');
  });
}
