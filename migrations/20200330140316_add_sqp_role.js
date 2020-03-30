const alterEnumColumn = require('../lib/alter-enum-column');

exports.up = function(knex) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'sqp', 'nio', 'ntco', 'nprc', 'holc'],
    null,
    false
  ));
};

exports.down = function(knex) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'nprc', 'holc'],
    null,
    false
  ));
};
