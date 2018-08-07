
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('invitations')
    .createTable('invitations', table => {
      table.string('token');
      table.enum('role', ['basic', 'read', 'admin']).defaultsTo('basic').notNull();
      table.timestamps(false, true);
      table.string('establishmentId').references('id').inTable('establishments').notNull();
      table.uuid('profileId').references('id').inTable('profiles').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('invitations');
};
