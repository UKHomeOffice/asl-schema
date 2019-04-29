exports.up = function(knex) {
  return knex.schema.table('asru_establishment', table => {
    table.dropUnique(['establishment_id','profile_id']);
  });
};

exports.down = function(knex) {
  return knex('asru_establishment').whereNotNull('deleted').del()
    .then(() => {
      return knex.schema.table('asru_establishment', table => {
        table.unique(['establishment_id','profile_id']);
      });
    })
};
