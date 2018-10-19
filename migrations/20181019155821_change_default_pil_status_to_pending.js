const alterEnumColumn = require('../lib/alter-enum-column');

exports.up = function(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'pils',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked'],
    'pending',
    true
  ));
};

exports.down = function(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'pils',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked'],
    'inactive',
    true
  ));
};
