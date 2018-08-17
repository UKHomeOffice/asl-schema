
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('invitations', table => {
    table.text('token').alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schmea.alterTable('invitations', table => {
    table.string('token').alter();
  });
};
