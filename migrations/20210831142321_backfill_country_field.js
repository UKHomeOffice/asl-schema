
export function up(knex) {
  return knex('establishments').update({ country: 'england' }).whereNull('country');
}

export function down(knex) {
  return Promise.resolve();
}
