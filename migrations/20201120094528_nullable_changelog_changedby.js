
export function up(knex) {
  return knex.schema.alterTable('changelog', table => {
    table.uuid('changed_by').nullable().alter();
  });
}

export function down(knex) {
  return knex.schema.alterTable('changelog', table => {
    table.uuid('changed_by').notNullable().alter();
  });
}
