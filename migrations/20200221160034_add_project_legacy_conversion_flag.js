
export function up(knex) {
  return knex.schema.table('projects', table => {
    table.boolean('is_legacy_conversion').defaultTo(false);
  });
}

export function down(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('is_legacy_conversion');
  });
}
