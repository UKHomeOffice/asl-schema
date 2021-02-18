
exports.up = function(knex) {
  return knex.raw(`
    UPDATE project_versions
    SET licence_holder_id = projects.licence_holder_id
    FROM projects
    WHERE projects.id = project_versions.project_id
  `);
};

exports.down = function(knex) {
  return Promise.resolve();
};
