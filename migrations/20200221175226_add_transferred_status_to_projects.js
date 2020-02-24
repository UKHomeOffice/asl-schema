const alterEnumColumn = require('../lib/alter-enum-column');

exports.up = function(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'projects',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked', 'transferred'],
    'inactive',
    false
  ));
};

exports.down = function(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'projects',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked'],
    'inactive',
    false
  ));
};
