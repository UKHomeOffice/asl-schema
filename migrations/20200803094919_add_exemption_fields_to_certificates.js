
export function up(knex, Promise) {
  return knex.schema.table('certificates', table => {
    table.boolean('is_exemption').defaultsTo(false);
    table.text('exemption_reason').nullable();
  });
}

export function down(knex, Promise) {
  return knex.schema.table('certificates', table => {
    table.dropColumn('is_exemption');
    table.dropColumn('exemption_reason');
  });
}
