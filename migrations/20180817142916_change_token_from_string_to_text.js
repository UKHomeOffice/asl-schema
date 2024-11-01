
export function up(knex, Promise) {
  return knex.schema.alterTable('invitations', table => {
    table.text('token').alter();
  });
}

export function down(knex, Promise) {
  return knex.schmea.alterTable('invitations', table => {
    table.string('token').alter();
  });
}
