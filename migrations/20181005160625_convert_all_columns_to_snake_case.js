
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('authorisations', table => {
    table.renameColumn('establishmentId', 'establishment_id');
  })
  .alterTable('establishments', table => {
    table.renameColumn('issueDate', 'issue_date');
    table.renameColumn('revocationDate', 'revocation_date');
    table.renameColumn('licenceNumber', 'licence_number');
  })
  .alterTable('invitations', table => {
    table.renameColumn('establishmentId', 'establishment_id');
    table.renameColumn('profileId', 'profile_id');
  })
  .alterTable('permissions', table => {
    table.renameColumn('establishmentId', 'establishment_id');
    table.renameColumn('profileId', 'profile_id');
  })
  .alterTable('places', table => {
    table.renameColumn('establishmentId', 'establishment_id');
    table.renameColumn('nacwoId', 'nacwo_id');
  })
  .alterTable('profiles', table => {
    table.renameColumn('userId', 'user_id');
    table.renameColumn('firstName', 'first_name');
    table.renameColumn('lastName', 'last_name');
  })
  .alterTable('projects', table => {
    table.renameColumn('establishmentId', 'establishment_id');
    table.renameColumn('issueDate', 'issue_date');
    table.renameColumn('expiryDate', 'expiry_date');
    table.renameColumn('revocationDate', 'revocation_date');
    table.renameColumn('licenceNumber', 'licence_number');
    table.renameColumn('licenceHolderId', 'licence_holder_id');
  })
  .alterTable('roles', table => {
    table.renameColumn('establishmentId', 'establishment_id');
    table.renameColumn('profileId', 'profile_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('authorisations', table => {
    table.renameColumn('establishment_id', 'establishmentId');
  })
  .alterTable('establishments', table => {
    table.renameColumn('issue_date', 'issueDate');
    table.renameColumn('revocation_date', 'revocationDate');
    table.renameColumn('licence_number', 'licenceNumber');
  })
  .alterTable('invitations', table => {
    table.renameColumn('establishment_id', 'establishmentId');
    table.renameColumn('profile_id', 'profileId');
  })
  .alterTable('permissions', table => {
    table.renameColumn('establishment_id', 'establishmentId');
    table.renameColumn('profile_id', 'profileId');
  })
  .alterTable('places', table => {
    table.renameColumn('establishment_id', 'establishmentId');
    table.renameColumn('nacwo_id', 'nacwoId');
  })
  .alterTable('profiles', table => {
    table.renameColumn('user_id', 'userId');
    table.renameColumn('first_name', 'firstName');
    table.renameColumn('last_name', 'lastName');
  })
  .alterTable('projects', table => {
    table.renameColumn('establishment_id', 'establishmentId');
    table.renameColumn('issue_date', 'issueDate');
    table.renameColumn('expiry_date', 'expiryDate');
    table.renameColumn('revocation_date', 'revocationDate');
    table.renameColumn('licence_number', 'licenceNumber');
    table.renameColumn('licence_holder_id', 'licenceHolderId');
  })
  .alterTable('roles', table => {
    table.renameColumn('establishment_id', 'establishmentId');
    table.renameColumn('profile_id', 'profileId');
  });
};
