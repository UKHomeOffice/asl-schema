
exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE establishments
      ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (START WITH 2000001);
  `);
};

exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE establishments
      ALTER COLUMN id DROP IDENTITY;
  `);
};
