
export function up(knex, Promise) {
  return knex.schema.table('pils', table => {
    table.jsonb('procedures');
    table.text('cat_d_notes');
    table.text('cat_f_notes');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('pils', table => {
    table.dropColumn('procedures');
    table.dropColumn('cat_d_notes');
    table.dropColumn('cat_f_notes');
  });
}
