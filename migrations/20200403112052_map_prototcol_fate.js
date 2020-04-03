const transform = version => {
  if (!version) {
    return;
  }
  if (!version.protocols || !Array.isArray(version.protocols)) {
    return version;
  }
  version.protocols.forEach(protocol => {
    if (!protocol || !protocol['killing-method'] || !Array.isArray(protocol['killing-method'])) {
      return;
    }
    if (protocol['killing-method'].includes('other')) {
      return protocol['non-schedule-1'] = true;
    }
    if (protocol['killing-method'].includes('schedule-1')) {
      return protocol['non-schedule-1'] = false;
    }

  });
  return version;
};

exports.transform = transform;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex
        .select('id')
        .from('projects')
        .where({ 'schema_version': 1 })
    })
    .then(projects => {
      return projects.reduce((promise, project) => {
        return promise
          .then(() => {
            return knex
              .select('id', 'data')
              .from('project_versions')
              .where({ 'project_id': project.id })
              .then(versions => {
                return versions.reduce((promise, version) => {
                  return promise
                    .then(() => {
                      const data = transform(version.data);
                      if (!data) {
                        return Promise.resolve();
                      }
                      return knex('project_versions')
                        .where({ id: version.id })
                        .update({ data });
                    });
                }, Promise.resolve())
              })
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
