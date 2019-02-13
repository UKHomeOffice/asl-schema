
exports.up = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('project_versions')
    .createTable('project_versions', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('parent_id').references('id').inTable('project_versions');
      table.jsonb('data');
      table.timestamps(false, true);
      table.dateTime('deleted');
    })
    .table('projects', table => {
      table.uuid('granted_id').references('id').inTable('project_versions');
      table.integer('schema_version').notNull().defaultTo(1);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('projects', table => {
      table.dropColumn('granted_id');
      table.dropColumn('schema_version');
    })
    .dropTableIfExists('project_versions')
};
