import alterEnumColumn from '../lib/alter-enum-column.js';

export function up(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'permissions',
    'role',
    ['basic', 'read', 'admin', 'blocked'],
    'basic',
    false
  ));
}

export function down(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'permissions',
    'role',
    ['basic', 'read', 'admin'],
    'basic',
    false
  ));
}
