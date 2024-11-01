
export function up(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.renameColumn('transferred_in', 'transferred_in_date');
    table.renameColumn('transferred_out', 'transferred_out_date');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.renameColumn('transferred_in_date', 'transferred_in');
    table.renameColumn('transferred_out_date', 'transferred_out');
  });
}
