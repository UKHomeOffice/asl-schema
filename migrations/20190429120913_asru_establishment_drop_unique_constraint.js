export function up(knex, Promise) {
  return knex.schema.table('asru_establishment', table => {
    table.dropUnique(['establishment_id', 'profile_id']);
  });
}

export function down(knex, Promise) {
  return knex('asru_establishment').whereNotNull('deleted').del()
    .then(() => {
      return knex.schema.table('asru_establishment', table => {
        table.unique(['establishment_id', 'profile_id']);
      });
    });
}
