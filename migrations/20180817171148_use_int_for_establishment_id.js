exports.up = function(knex, Promise) {
  return knex.schema
    // remove any fk relations for establishment id
    .table('invitations', table => {
      table.dropPrimary();
      table.dropForeign('establishmentId');
    })

    .table('permissions', table => {
      table.dropPrimary();
      table.dropForeign('establishmentId');
    })

    .table('authorisations', table => table.dropForeign('establishmentId'))
    .table('pils', table => table.dropForeign('establishmentId'))
    .table('places', table => table.dropForeign('establishmentId'))
    .table('projects', table => table.dropForeign('establishmentId'))
    .table('roles', table => table.dropForeign('establishmentId'))

    // remove pk, change establishment.id to int, re-add pk
    .table('establishments', table => table.dropPrimary())
    .alterTable('establishments', table => table.integer('id').primary().alter())

    // change establishmentId to int and re-add any fk relations
    .alterTable('authorisations', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('invitations', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
      table.primary(['profileId', 'establishmentId']);
    })

    .alterTable('permissions', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
      table.primary(['profileId', 'establishmentId']);
    })

    .alterTable('pils', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('places', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('projects', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('roles', table => {
      table.integer('establishmentId').references('id').inTable('establishments').alter();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    // remove any fk relations for establishment id
    .table('invitations', table => {
      table.dropPrimary();
      table.dropForeign('establishmentId');
    })

    .table('permissions', table => {
      table.dropPrimary();
      table.dropForeign('establishmentId');
    })

    .table('authorisations', table => table.dropForeign('establishmentId'))
    .table('pils', table => table.dropForeign('establishmentId'))
    .table('places', table => table.dropForeign('establishmentId'))
    .table('projects', table => table.dropForeign('establishmentId'))
    .table('roles', table => table.dropForeign('establishmentId'))

    // remove pk, change establishment.id to string, re-add pk
    .table('establishments', table => table.dropPrimary())
    .alterTable('establishments', table => table.string('id').primary().alter())

    // change establishmentId to string and re-add any fk relations
    .alterTable('authorisations', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('invitations', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
      table.primary(['profileId', 'establishmentId']);
    })

    .alterTable('permissions', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
      table.primary(['profileId', 'establishmentId']);
    })

    .alterTable('pils', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('places', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('projects', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
    })

    .alterTable('roles', table => {
      table.string('establishmentId').references('id').inTable('establishments').alter();
    });
};
