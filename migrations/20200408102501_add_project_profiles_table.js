
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('project_profiles')
    .createTable('project_profiles', table => {
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.dateTime('deleted');
      table.timestamps(false, true);
      table.unique(['project_id','profile_id']);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('project_profiles');
};
