
exports.up = function(knex) {
  return knex.schema.table('establishments', table => {
    table.boolean('is_training_establishment').defaultsTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('is_training_establishment');
  });
};
