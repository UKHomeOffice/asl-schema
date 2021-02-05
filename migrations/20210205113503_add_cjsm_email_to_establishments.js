
exports.up = function(knex) {
  return knex.schema.table('establishments', table => {
    table.string('cjsm_email').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('establishments', table => {
    table.dropColumn('cjsm_email');
  });
};
