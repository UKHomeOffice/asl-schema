import alterEnumColumn from '../lib/alter-enum-column.js';

export async function up(knex) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'sqp', 'nio', 'ntco', 'nprc', 'holc'],
    null,
    false
  ));
}

export async function down(knex) {
  return knex.raw(alterEnumColumn(
    'roles',
    'type',
    ['pelh', 'nacwo', 'nvs', 'nio', 'ntco', 'nprc', 'holc'],
    null,
    false
  ));
}
