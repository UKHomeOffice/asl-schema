
export function up(knex, Promise) {
  return knex.schema.renameTable('trainingModules', 'training_modules')
    .table('training_modules', table => {
      table.renameColumn('profileId', 'profile_id');
    });
}

export function down(knex, Promise) {
  return knex.schema.table('training_modules', table => {
    table.renameColumn('profile_id', 'profileId');
  })
    .renameTable('training_modules', 'trainingModules');
}
