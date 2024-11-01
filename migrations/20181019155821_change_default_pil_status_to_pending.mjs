import alterEnumColumn from '../lib/alter-enum-column.js';

export async function up(knex) {
  return knex.raw(alterEnumColumn(
    'pils',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked'],
    'pending',
    true
  ));
}

export async function down(knex) {
  return knex.raw(alterEnumColumn(
    'pils',
    'status',
    ['active', 'pending', 'inactive', 'expired', 'revoked'],
    'inactive',
    true
  ));
}
