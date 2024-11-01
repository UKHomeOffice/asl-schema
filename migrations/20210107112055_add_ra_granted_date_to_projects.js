
export function up(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.dateTime('ra_granted_date').nullable();
  });
}

export function down(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.dropColumn('ra_granted_date');
  });
}
