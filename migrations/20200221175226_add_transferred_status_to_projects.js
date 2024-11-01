import alterEnumColumn from '../lib/alter-enum-column.js';

export function up(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'projects',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked', 'transferred'],
    'inactive',
    false
  ));
}

export function down(knex, Promise) {
  return knex.raw(alterEnumColumn(
    'projects',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked'],
    'inactive',
    false
  ));
}
