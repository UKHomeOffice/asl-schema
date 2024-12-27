
export function up(knex, Promise) {
  return knex.schema
    .table('places', table => {
      table.renameColumn('notes', 'restrictions');
    });
}

export function down(knex, Promise) {
  return knex.schema
    .table('places', table => {
      table.renameColumn('restrictions', 'notes');
    });
}
