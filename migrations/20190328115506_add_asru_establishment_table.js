
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('asru_establishment')
    .createTable('asru_establishment', table => {
      table.integer('establishment_id').references('id').inTable('establishments').notNull();
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.dateTime('deleted');
      table.timestamps(false, true);
      table.unique(['establishment_id','profile_id']);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('asru_establishment');
};
