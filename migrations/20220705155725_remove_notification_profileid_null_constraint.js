
export function up(knex) {
  return knex.schema.alterTable('notifications', table => {
    table.uuid('profile_id').nullable().alter();
  });
}

export function down(knex) {
  return knex.schema.alterTable('notifications', table => {
    table.uuid('profile_id').notNull().alter();
  });
}
