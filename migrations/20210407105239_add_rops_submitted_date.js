export function up(knex) {
  return knex.schema.table('rops', table => {
    table.dateTime('submitted_date').nullable();
  })
    .then(() => {
      return knex.raw(`
        UPDATE rops
        SET submitted_date = updated_at
        WHERE status = 'submitted'
      `);
    });
}

export function down(knex) {
  return knex.schema.table('rops', table => {
    table.dropColumn('submitted_date');
  });
}
