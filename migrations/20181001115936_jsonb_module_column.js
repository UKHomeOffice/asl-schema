
exports.up = function(knex, Promise) {
  return knex.schema
  .raw('UPDATE training_modules SET "module" = to_json("module")')
  .alterTable('training_modules', table => {
    table.dropColumn('species');
    table.renameColumn('module', 'modules');
  })
  .alterTable('training_modules', table => {
    table.jsonb('modules').nullable().alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
  .alterTable('training_modules', table => {
    table.jsonb('species');
    table.renameColumn('modules', 'module');
  })
  .alterTable('training_modules', table => {
    table.string('module').nullable().alter();
  })
  .raw('UPDATE training_modules SET "module" = trim(BOTH \'"\' FROM "module")');
};
