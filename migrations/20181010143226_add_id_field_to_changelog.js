
export function up(knex, Promise) {
  return knex.schema.alterTable('changelog', table => {
    table.dropPrimary();
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('model_id').nullable().alter();
  });
}

export function down(knex, Promise) {
  return knex.schema.alterTable('changelog', table => {
    table.uuid('model_id').notNull().alter();
    table.dropColumn('id');
    table.primary('message_id');
  });
}
