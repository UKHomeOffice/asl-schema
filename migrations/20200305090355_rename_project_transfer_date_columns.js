
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.renameColumn('transferred_in', 'transferred_in_date');
    table.renameColumn('transferred_out', 'transferred_out_date');
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.renameColumn('transferred_in_date', 'transferred_in');
    table.renameColumn('transferred_out_date', 'transferred_out');
  });
};
