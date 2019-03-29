
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('profile_to_establishment')
    .createTable('profile_to_establishment', table => {
      table.integer('establishmentId').references('id').inTable('establishments').notNull();
      table.uuid('profileId').references('id').inTable('profiles').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('profile_to_establishment');
};
