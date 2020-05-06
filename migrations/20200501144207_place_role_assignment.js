
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('place_roles')
    .createTable('place_roles', table => {
      table.uuid('place_id').references('id').inTable('places').notNull();
      table.uuid('role_id').references('id').inTable('roles').notNull();
      table.dateTime('deleted');
      table.timestamps(false, true);
      table.unique(['place_id','role_id', 'deleted']);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('place_roles');
};
