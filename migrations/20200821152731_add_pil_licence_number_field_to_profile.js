
export function up(knex) {
  return knex.schema.table('profiles', table => {
    table.string('pil_licence_number').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('pil_licence_number');
  });
}
