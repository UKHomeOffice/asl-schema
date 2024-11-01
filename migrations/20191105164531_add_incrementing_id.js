
export function up(knex, Promise) {
  return knex.raw(`
    ALTER TABLE establishments
      ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (START WITH 2000001);
  `);
}

export function down(knex, Promise) {
  return knex.raw(`
    ALTER TABLE establishments
      ALTER COLUMN id DROP IDENTITY;
  `);
}
