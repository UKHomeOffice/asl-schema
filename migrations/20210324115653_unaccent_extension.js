
export function up(knex) {
  return knex.schema.raw('create extension if not exists "unaccent"');
}

export function down(knex) {
  return knex.schema.raw('drop extension if exists "unaccent"');
}
