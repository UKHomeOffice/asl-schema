
export function up(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.renameColumn('is_legacy_conversion', 'is_legacy_stub');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.renameColumn('is_legacy_stub', 'is_legacy_conversion');
  });
}
