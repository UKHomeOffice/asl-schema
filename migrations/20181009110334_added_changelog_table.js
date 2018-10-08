
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('changelog')
    .createTable('changelog', table => {
      table.uuid('id').primary().notNull();
      table.jsonb('message').notNull();
      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('changelog');
};
