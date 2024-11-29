import alterEnumColumn from '../lib/alter-enum-column.js';

export function up(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'nprc', 'holc'],
    null,
    false
  ));
}

export function down(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'holc'],
    null,
    false
  ));
}
