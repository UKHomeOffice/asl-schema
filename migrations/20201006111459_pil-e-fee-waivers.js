
exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex.schema
        .createTable('pil_fee_waivers', table => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

          table.integer('year').notNull();
          table.index('year');

          table.uuid('profile_id').references('id').inTable('profiles').notNull();
          table.index('profile_id');

          table.integer('establishment_id').references('id').inTable('establishments').notNull();
          table.index('establishment_id');

          table.text('comment');
          table.uuid('waived_by_id').references('id').inTable('profiles').notNull();

          table.timestamps(false, true);
          table.dateTime('deleted');
        });
    })
    .then(() => {
      return knex.table('fee_waivers')
        .join('pils', 'fee_waivers.pil_id', 'pils.id')
        .select(
          'fee_waivers.id',
          'fee_waivers.establishment_id',
          'fee_waivers.year',
          'fee_waivers.comment',
          'fee_waivers.updated_at',
          'fee_waivers.created_at',
          'fee_waivers.deleted',
          { waived_by_id: 'fee_waivers.profile_id' },
          'pils.profile_id'
        );
    })
    .then(waivers => {
      if (waivers.length > 0) {
        return knex('pil_fee_waivers').insert(waivers);
      }
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pil_fee_waivers');
};
