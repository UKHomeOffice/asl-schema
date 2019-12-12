
exports.up = function(knex) {
  return knex.schema
    .table('pils', table => { table.dateTime('review_date') });
};

exports.down = function(knex) {
  return knex.schema
    .table('pils', table => { table.dropColumn('review_date') });
};
