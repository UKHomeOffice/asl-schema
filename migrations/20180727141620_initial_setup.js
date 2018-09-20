
exports.up = function(knex, Promise) {

  return knex.schema
    .dropTableIfExists('trainingModules')
    .dropTableIfExists('projects')
    .dropTableIfExists('places')
    .dropTableIfExists('permissions')
    .dropTableIfExists('roles')
    .dropTableIfExists('pils')
    .dropTableIfExists('profiles')
    .dropTableIfExists('authorisations')
    .dropTableIfExists('establishments')
    .raw('create extension if not exists "uuid-ossp"')
    .createTable('establishments', table => {
      table.string('id').primary();
      table.string('migrated_id');
      table.string('name').notNull();
      table.string('type');
      table.enum('status', ['active', 'pending', 'inactive', 'expired', 'revoked']).defaultsTo('inactive');
      table.dateTime('issueDate');
      table.dateTime('revocationDate');
      table.string('licenceNumber');
      table.enum('country', ['england', 'scotland', 'wales', 'ni']).notNull();
      table.string('address').notNull();
      table.string('email').notNull();
      table.boolean('procedure').defaultTo(false);
      table.boolean('breeding').defaultTo(false);
      table.boolean('supplying').defaultTo(false);
      table.boolean('killing').defaultTo(false);
      table.boolean('rehomes').defaultTo(false);
      table.text('conditions');
      table.timestamps(false, true);
    })

    .createTable('authorisations', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.enum('type', ['killing', 'rehomes']).notNull();
      table.text('method');
      table.text('description');
      table.timestamps(false, true);
      table.string('establishmentId').references('id').inTable('establishments');
    })

    .createTable('profiles', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('migrated_id');
      table.string('userId').unique();
      table.string('title');
      table.string('firstName').notNull();
      table.string('lastName').notNull();
      table.date('dob');
      table.string('position');
      table.string('qualifications');
      table.string('certifications');
      table.string('address');
      table.string('postcode');
      table.string('email').notNull().unique();
      table.string('telephone');
      table.text('notes');
      table.timestamps(false, true);
    })

    .createTable('roles', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('migrated_id');
      table.enum('type', ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'holc']);
      table.string('establishmentId').references('id').inTable('establishments');
      table.uuid('profileId').references('id').inTable('profiles');
      table.timestamps(false, true);
    })

    .createTable('places', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('migrated_id');
      table.string('site');
      table.string('area');
      table.string('name');
      table.jsonb('suitability');
      table.jsonb('holding');
      table.text('notes');
      table.dateTime('deleted');
      table.timestamps(false, true);
      table.string('establishmentId').references('id').inTable('establishments');
      table.uuid('nacwoId').references('id').inTable('roles');
    })

    .createTable('projects', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('migrated_id');
      table.enum('status', ['active', 'pending', 'inactive', 'expired', 'revoked']).defaultsTo('inactive');
      table.string('title').notNull();
      table.dateTime('issueDate');
      table.dateTime('expiryDate');
      table.dateTime('revocationDate');
      table.string('licenceNumber');
      table.timestamps(false, true);
      table.string('establishmentId').references('id').inTable('establishments');
      table.uuid('licenceHolderId').references('id').inTable('profiles');
    })

    .createTable('pils', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('migrated_id');
      table.enum('status', ['active', 'pending', 'inactive', 'expired', 'revoked']).defaultsTo('inactive');
      table.dateTime('issueDate');
      table.dateTime('revocationDate');
      table.string('licenceNumber');
      table.text('conditions');
      table.timestamps(false, true);
      table.string('establishmentId').references('id').inTable('establishments');
      table.uuid('profileId').references('id').inTable('profiles');
    })

    .createTable('trainingModules', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('migrated_id');
      table.string('module');
      table.jsonb('species');
      table.date('pass_date');
      table.boolean('not_applicable').defaultsTo(false);
      table.string('accrediting_body');
      table.string('other_accrediting_body');
      table.string('certificate_number');
      table.boolean('exemption').defaultsTo(false);
      table.text('exemption_description');
      table.timestamps(false, true);
      table.uuid('profileId').references('id').inTable('profiles');
    })

    .createTable('permissions', table => {
      table.enum('role', ['basic', 'read', 'admin']).defaultsTo('basic').notNull();
      table.timestamps(false, true);
      table.string('establishmentId').references('id').inTable('establishments').notNull();
      table.uuid('profileId').references('id').inTable('profiles').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('permissions')
    .dropTable('trainingModules')
    .dropTable('pils')
    .dropTable('projects')
    .dropTable('roles')
    .dropTable('profiles')
    .dropTable('places')
    .dropTable('authorisations')
    .dropTable('establishments')
    .raw('drop extension if exists "uuid-ossp"');
};
