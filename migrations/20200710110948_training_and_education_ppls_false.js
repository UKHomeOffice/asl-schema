const transform = data => {
  const isTrainingLicence = data['training-licence'] || (data['permissible-purpose'] || []).includes('higher-education');
  return { ['training-licence']: isTrainingLicence, ...data };
};

exports.transform = transform;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex('project_versions')
        .select('project_versions.id')
        .join('projects', 'project_versions.project_id', 'projects.id')
        .where({ 'schema_version':  1 })
        .whereNotNull('data')
        .whereRaw('data->>\'training-licence\' IS NULL');
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
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ data });
              });
          })
          .catch(e => {
            console.error(`Failed to update project ${version.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
