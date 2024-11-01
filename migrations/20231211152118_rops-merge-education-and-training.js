
export function up(knex) {
  return knex.raw(
    `UPDATE rops
SET purposes = rops.purposes - '{education,training}'::text[] || '"education_or_training"'
WHERE purposes @> '["education"]' OR purposes @> '["training"]';
`
  );
}

export function down(knex) {
  return knex.raw(
    `UPDATE rops
SET purposes = rops.purposes - '{education_or_training}'::text[] || '["education","training"]'::jsonb
WHERE purposes @> '["education_or_training"]';
`
  );
}
