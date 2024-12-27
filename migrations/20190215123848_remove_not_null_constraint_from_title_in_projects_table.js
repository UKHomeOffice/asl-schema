
export function up(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.string('title').nullable().alter();
  });
}

export function down(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.string('title').notNull().alter();
  });
}
