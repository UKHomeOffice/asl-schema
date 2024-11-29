
export function up(knex) {
  return knex.schema.table('establishments', table => {
    table.string('cjsm_email').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('cjsm_email');
  });
}
