const alterEnumColumn = require('../lib/alter-enum-column');

exports.up = function(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'nprc', 'holc'],
    null,
    false
  ));
};

exports.down = function(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'holc'],
    null,
    false
  ));
};
