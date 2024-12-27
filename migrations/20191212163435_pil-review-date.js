
export function up(knex, Promise) {
  return knex.schema
    .table('pils', table => { table.dateTime('review_date'); });
}

export function down(knex, Promise) {
  return knex.schema
    .table('pils', table => { table.dropColumn('review_date'); });
}
