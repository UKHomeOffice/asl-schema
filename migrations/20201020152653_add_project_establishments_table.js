
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('project_establishments')
    .createTable('project_establishments', table => {
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.uuid('version_id').references('id').inTable('project_versions').nullable();
      table.enum('status', ['draft', 'active', 'removed']).defaultsTo('draft');
      table.timestamps(false, true);
      table.unique(['project_id', 'establishment_id']);
      table.index('status');
      table.index('establishment_id');
      table.index('project_id');
      table.index('version_id');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('project_establishments');
};
