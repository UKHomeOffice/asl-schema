const uuid = require('uuid/v4');

const transform = version => {
  if (!version) {
    return;
  }
  if (!version['project-continuation'] || !Array.isArray(version['project-continuation'])) {
    return;
  }
  version['project-continuation'].forEach(item => {
    if (item && !item.id) {
      item.id = uuid();
    }
  });
  return version;
};

exports.transform = transform;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex('project_versions')
        .select('project_versions.id')
        .join('projects', 'project_versions.project_id', 'projects.id')
        .where({ 'schema_version':  1 })
        .whereRaw('data->>\'project-continuation\' IS NOT NULL');
    })
    .then(versions => {
      console.log(`found ${versions.length} versions`)
      return versions.reduce((promise, version, index) => {
        return promise
          .then(() => {
            console.log(`patching version: ${version.id}, ${index + 1} of ${versions.length}`);
            return knex('project_versions')
              .select('project_versions.id', 'data')
              .where({ 'project_versions.id': version.id })
              .first()
              .then(version => {
                const data = transform(version.data);
                if (!data) {
                  return Promise.resolve();
                }
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ data });
              });
          })
          .catch(e => {
            console.error(`Failed to update project ${project.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
