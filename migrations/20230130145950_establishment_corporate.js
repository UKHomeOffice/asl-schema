
exports.up = function(knex) {
  return knex.schema.table('establishments', table => {
    table.string('corporate_status').nullable();
    table.string('legal_name').nullable();
    table.string('legal_phone').nullable();
    table.string('legal_email').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('corporate_status');
    table.dropColumn('legal_name');
    table.dropColumn('legal_phone');
    table.dropColumn('legal_email');
  });
};
