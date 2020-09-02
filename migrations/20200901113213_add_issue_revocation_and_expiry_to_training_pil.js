
exports.up = function(knex) {
  return knex.schema.table('training_pils', table => {
    table.dateTime('issue_date').nullable();
    table.dateTime('revocation_date').nullable();
    table.dateTime('expiry_date').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('training_pils', table => {
    table.dropColumn('issue_date');
    table.dropColumn('revocation_date');
    table.dropColumn('expiry_date');
  });
};
