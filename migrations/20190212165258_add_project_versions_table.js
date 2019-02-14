
exports.up = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('project_versions')
    .createTable('project_versions', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.jsonb('data');
      table.dateTime('granted_at');
      table.dateTime('submitted_at');
      table.timestamps(false, true);
      table.dateTime('deleted');
    })
    .table('projects', table => {
      table.integer('schema_version').notNull().defaultTo(1);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('projects', table => {
      table.dropColumn('schema_version');
    })
    .dropTableIfExists('project_versions')
};
