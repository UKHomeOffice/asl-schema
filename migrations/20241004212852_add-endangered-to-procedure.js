
export function up(knex) {
  return knex.schema.table('procedures', (table) => {
    table.boolean('endangered').nullable();
    table.string('endangered_details').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('procedures', (table) => {
    table.dropColumn('endangered');
    table.dropColumn('endangered_details');
  });
}
