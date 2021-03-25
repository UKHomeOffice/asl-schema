
exports.up = function(knex) {
  return knex.schema.raw('create extension if not exists "unaccent"');
};

exports.down = function(knex) {
  return knex.schema.raw('drop extension if exists "unaccent"');
};
