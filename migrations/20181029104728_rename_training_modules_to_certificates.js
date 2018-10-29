
exports.up = function(knex, Promise) {
  return knex.schema.renameTable('training_modules', 'certificates')
    .table('certificates', table => {
      table.dropColumn('exemption');
      table.dropColumn('exemption_description');
      table.dropColumn('not_applicable')
    })
    .createTable('exemptions', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('module').notNull();
      table.text('description');
      table.uuid('profile_id').references('id').inTable('profiles').notNull();
      table.timestamps(false, true);
      table.dateTime('deleted');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.renameTable('certificates', 'training_modules')
    .dropTableIfExists('exemptions')
    .table('training_modules', table => {
      table.boolean('exemption').defaultsTo(false);
      table.text('exemption_description');
      table.boolean('not_applicable').defaultsTo(false);
    });
};
