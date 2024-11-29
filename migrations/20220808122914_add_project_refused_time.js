
export function up(knex) {
  return knex.schema.table('projects', table => {
    table.dateTime('refused_date').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('refused_date');
  });
}
