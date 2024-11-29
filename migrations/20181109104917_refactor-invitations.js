
export function up(knex, Promise) {
  return knex.schema.table('invitations', table => {
    table.dropColumn('profile_id');
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email');
  });
}

export function down(knex, Promise) {
  return knex.schema.table('invitations', table => {
    table.dropColumn('email');
    table.dropColumn('id');
    table.uuid('profile_id').references('id').inTable('profiles').notNull();
  });
}
