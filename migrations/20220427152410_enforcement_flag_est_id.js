
export function up(knex) {
  return knex.schema.alterTable('enforcement_flags', table => {
    table.integer('establishment_id').nullable().alter();
  });
}

export function down(knex) {
  return knex.schema.alterTable('enforcement_flags', table => {
    table.integer('establishment_id').notNullable().alter();
  });
}
