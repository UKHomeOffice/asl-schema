const alterEnumColumn = require('../lib/alter-enum-column');

exports.up = function(knex) {
  return knex.raw(alterEnumColumn(
    'permissions',
    'role',
    ['basic', 'read', 'admin', 'blocked'],
    'basic',
    false
  ));
};

exports.down = function(knex) {
  return knex.raw(alterEnumColumn(
    'permissions',
    'role',
    ['basic', 'read', 'admin'],
    'basic',
    false
  ));
};
