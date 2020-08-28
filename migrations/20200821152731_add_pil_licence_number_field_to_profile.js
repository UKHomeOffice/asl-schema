
exports.up = function(knex) {
  return knex.schema.table('profiles', table => {
    table.string('pil_licence_number').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('profiles', table => {
    table.dropColumn('pil_licence_number');
  });
};
