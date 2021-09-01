
exports.up = function(knex) {
  return knex('establishments').update({ country: 'england' }).whereNull('country');
};

exports.down = function(knex) {
  return Promise.resolve();
};
