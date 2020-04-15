const alterEnumColumn = require('../lib/alter-enum-column');

exports.up = function(knex) {
  return knex.raw(alterEnumColumn(
    'permissions',
    'role',
    ['basic', 'read', 'admin', 'blocked'],
    null,
    false
  ));
};

exports.down = function(knex) {
  return knex.raw(alterEnumColumn(
    'permissions',
    'role',
    ['basic', 'read', 'admin'],
    null,
    false
  ));
};
