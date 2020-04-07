const transform = version => {
  if (!version) {
    return;
  }
  if (!version.protocols || !Array.isArray(version.protocols)) {
    return;
  }
  version.protocols.forEach(protocol => {
    if (!protocol || !protocol['killing-method'] || !Array.isArray(protocol['killing-method'])) {
      return;
    }
    if (protocol['killing-method'].includes('other')) {
      version.patched = true;
      return protocol['non-schedule-1'] = true;
    }
    if (protocol['killing-method'].includes('schedule-1')) {
      version.patched = true;
      return protocol['non-schedule-1'] = false;
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
        .where({ 'schema_version':  1 });
    })
    .then(versions => {
      console.log(`found ${versions.length} versions`)
      return versions.reduce((promise, version, index) => {
        return promise
          .then(() => {
            console.log(`patching version: ${version.id}, ${index + 1} of ${versions.length}`);
            return knex('project_versions')
              .select('id', 'data')
              .where({ id: version.id })
              .first()
              .then(version => {
                const data = transform(version.data);
                if (!data) {
                  return Promise.resolve();
                }
                if (!data.patched) {
                  console.log(`Skipping ${version.id} as no changes required.`)
                  return Promise.resolve();
                }
                delete data.patched;
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ data });
              })
              .then(() => {
                console.log(`finshed patching version: ${version.id}, ${index + 1} of ${versions.length}`);
              })
          })
          .catch(e => {
            console.error(`Failed to update project version: ${version.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
