
export function up(knex) {
  return knex.schema.table('profiles', table => {
    table.string('rcvs_number');
  });
}

export function down(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('rcvs_number');
  });
}
