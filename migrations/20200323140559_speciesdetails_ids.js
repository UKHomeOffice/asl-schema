import { v4 as uuidv4 } from 'uuid';

const transform = version => {
  if (!version) {
    return;
  }
  if (!version.protocols || !Array.isArray(version.protocols)) {
    return version;
  }
  version.protocols.forEach(protocol => {
    if (!protocol || !protocol.speciesDetails || !Array.isArray(protocol.speciesDetails)) {
      return;
    }
    protocol.speciesDetails.forEach(species => {
      if (!species) {
        return;
      }
      species.id = species.id || uuidv4();
    });
  });
  return version;
};

export {transform};

export function up(knex) {
  return Promise.resolve()
    .then(() => {
      return knex
        .select('id')
        .from('projects')
        .where({ 'schema_version': 1 });
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
}

export function down(knex) {
  // lolno
}
