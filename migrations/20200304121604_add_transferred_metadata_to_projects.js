
exports.up = function(knex) {
  return knex.schema.table('projects', table => {
    table.dateTime('transferred_in').nullable();
    table.dateTime('transferred_out').nullable();
    table.uuid('previous_project_id').references('id').inTable('projects').nullable();
    table.integer('previous_establishment_id').references('id').inTable('establishments').nullable();
    table.uuid('transfer_project_id').references('id').inTable('projects').nullable();
    table.integer('transfer_establishment_id').references('id').inTable('establishments').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('projects', table => {
    table.dropColumn('transferred_in');
    table.dropColumn('transferred_out');
    table.dropColumn('previous_project_id');
    table.dropColumn('previous_establishment_id');
    table.dropColumn('transfer_project_id');
    table.dropColumn('transfer_establishment_id');
  });
};
