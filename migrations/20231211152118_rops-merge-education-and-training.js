
exports.up = async function(knex) {
  return await knex.raw(
    `UPDATE rops
SET purposes = rops.purposes - '{education,training}'::text[] || '"education_or_training"'
WHERE purposes @> '["education"]' OR purposes @> '["training"]';
`
  )
};

exports.down = async function(knex) {
  return await knex.raw(
    `UPDATE rops
SET purposes = rops.purposes - '{education_or_training}'::text[] || '["education","training"]'::jsonb
WHERE purposes @> '["education_or_training"]';
`
  )
};

