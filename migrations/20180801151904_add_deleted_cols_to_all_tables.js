
exports.up = function(knex, Promise) {
  return knex.schema.table('establishments', table => { table.dateTime('deleted') })
    .table('authorisations', table => { table.dateTime('deleted') })
    .table('profiles', table => { table.dateTime('deleted') })
    .table('roles', table => { table.dateTime('deleted') })
    .table('projects', table => { table.dateTime('deleted') })
    .table('pils', table => { table.dateTime('deleted') })
    .table('trainingModules', table => { table.dateTime('deleted') })
    .table('permissions', table => { table.dateTime('deleted') });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('permissions', table => { table.dropColumn('deleted') })
    .table('trainingModules', table => { table.dropColumn('deleted') })
    .table('pils', table => { table.dropColumn('deleted') })
    .table('projects', table => { table.dropColumn('deleted') })
    .table('roles', table => { table.dropColumn('deleted') })
    .table('profiles', table => { table.dropColumn('deleted') })
    .table('authorisations', table => { table.dropColumn('deleted') })
    .table('establishments', table => { table.dropColumn('deleted') });
};
