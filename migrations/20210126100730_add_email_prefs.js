
export function up(knex) {
  return knex.schema
    .createTable('email_preferences', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('profile_id').references('id').inTable('profiles').notNull().unique();
      table.jsonb('preferences');
      table.timestamps(false, true);
    });
}

export function down(knex) {
  return knex.schema.dropTable('email_preferences');
}
