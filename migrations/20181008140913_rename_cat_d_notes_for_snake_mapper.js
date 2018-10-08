// The snakeCaseMapper doesn't seem to cope with single letter uppercase so lets rearrage the words to help it

exports.up = function(knex, Promise) {
  return knex.schema.alterTable('pils', table => {
    table.renameColumn('cat_d_notes', 'notes_cat_d');
    table.renameColumn('cat_f_notes', 'notes_cat_f');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('pils', table => {
    table.renameColumn('notes_cat_d', 'cat_d_notes');
    table.renameColumn('notes_cat_f', 'cat_f_notes');
  });
};
