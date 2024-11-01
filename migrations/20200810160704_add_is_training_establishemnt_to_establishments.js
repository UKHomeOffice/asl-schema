
export function up(knex, Promise) {
  return knex.schema.table('establishments', table => {
    table.boolean('is_training_establishment').defaultsTo(false);
  });
}

export function down(knex, Promise) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('is_training_establishment');
  });
}
