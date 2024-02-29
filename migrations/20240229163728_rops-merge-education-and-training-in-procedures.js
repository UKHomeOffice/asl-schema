/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(
    `UPDATE procedures
SET purposes = 'education_or_training'
WHERE purposes = 'education' OR purposes = 'training';`
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(
    `UPDATE procedures
SET purposes = 'training'
WHERE purposes = 'education_or_training';`
  );
};
