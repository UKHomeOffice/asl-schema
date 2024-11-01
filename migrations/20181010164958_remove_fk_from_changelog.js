
export function up(knex, Promise) {
  return knex.schema.alterTable('changelog', table => {
    table.dropForeign('changed_by');
    table.dropForeign('establishment_id');
  });
}

export function down(knex, Promise) {
  return knex.schema.alterTable('changelog', table => {
    table.foreign('establishment_id').references('id').inTable('establishments');
    table.foreign('changed_by').references('id').inTable('profiles');
  });
}
