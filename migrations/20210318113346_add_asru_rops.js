
export function up(knex) {
  return knex.schema.table('profiles', table => {
    table.boolean('asru_rops').defaultsTo(false);
  });
}

export function down(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('asru_rops');
  });
}
