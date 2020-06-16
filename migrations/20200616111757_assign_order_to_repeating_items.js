const { isUndefined, omit } = require('lodash');

const transform = version => {
  if (!version) {
    return;
  }

  function assignOrder(item, index) {
    if (!item) {
      return;
    }

    if (isUndefined(item.order)) {
      item.order = index;
      version.patched = true;
    }
  }

  if (version.protocols && Array.isArray(version.protocols)) {
    version.protocols.forEach((protocol, protocolIndex) => {
      assignOrder(protocol, protocolIndex);
      if (!protocol.steps || !Array.isArray(protocol.steps)) {
        return;
      }
      protocol.steps.forEach(assignOrder);
    });
  }

  if (version.objectives && Array.isArray(version.objectives)) {
    version.objectives.forEach(assignOrder);
  }

  if (version.establishments && Array.isArray(version.establishments)) {
    version.establishments.forEach(assignOrder);
  }

  if (version.polesList && Array.isArray(version.polesList)) {
    version.polesList.forEach(assignOrder);
  }

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
              .orderBy('created_at', 'desc')
              .first()
              .then(version => {
                const data = transform(version.data);
                if (!data || !data.patched) {
                  return Promise.resolve();
                }
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ data: omit(data, 'patched') });
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
};
