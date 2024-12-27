
export function up(knex, Promise) {
  return knex.schema.table('project_versions', table => {
    table.boolean('ra_compulsory').defaultsTo(false);
  });
}

export function down(knex, Promise) {
  return knex.schema.table('project_versions', table => {
    table.dropColumn('ra_compulsory');
  });
}
