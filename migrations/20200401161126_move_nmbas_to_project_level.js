const { some } = require('lodash');

const transform = data => {
  if (!data) {
    return;
  }

  if (!data.protocols || !Array.isArray(data.protocols)) {
    return data;
  }

  const nmbasUsed = some(data.protocols, protocol => {
    return protocol && protocol.steps && some(protocol.steps, step => step && step.nmbas);
  });

  if (nmbasUsed) {
    data['nmbas-used'] = true;
  }

  return data;
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
      return versions.reduce((promise, version) => {
        return promise
          .then(() => {
            return knex('project_versions')
              .select('id', 'data')
              .where({ id: version.id })
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
  // lolno
  return Promise.resolve();
};
