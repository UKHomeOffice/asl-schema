
exports.up = function(knex) {
  return knex.raw(
    `UPDATE rops
SET purposes = rops.purposes - '{education,training}'::text[] || '"education_or_training"'
WHERE purposes @> '["education"]' OR purposes @> '["training"]';
`
  );
};

exports.down = function(knex) {
  return knex.raw(
    `UPDATE rops
SET purposes = rops.purposes - '{education_or_training}'::text[] || '["education","training"]'::jsonb
WHERE purposes @> '["education_or_training"]';
`
  );
};
