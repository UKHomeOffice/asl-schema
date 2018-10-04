
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('pils', table => {
    table.renameColumn('issueDate', 'issue_date');
    table.renameColumn('revocationDate', 'revocation_date');
    table.renameColumn('licenceNumber', 'licence_number');
    table.renameColumn('establishmentId', 'establishment_id');
    table.renameColumn('profileId', 'profile_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('pils', table => {
    table.renameColumn('issue_date', 'issueDate');
    table.renameColumn('revocation_date', 'revocationDate');
    table.renameColumn('licence_number', 'licenceNumber');
    table.renameColumn('establishment_id', 'establishmentId');
    table.renameColumn('profile_id', 'profileId');
  });
};
