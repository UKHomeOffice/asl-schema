import {addedByAsru} from '../lib/retrospective-assessment.js';

function transform(version) {
  if (!version) {
    return;
  }

  return {
    ...version,
    retrospectiveAssessment: addedByAsru(version)
  };
}

export {transform};

export function up(knex) {
  return Promise.resolve()
    .then(() => {
      return knex('project_versions')
        .select('id');
    })
    .then(versions => {
      console.log(`found ${versions.length} versions`);
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
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ data });
              })
              .then(() => {
                console.log(`finshed patching version: ${version.id}, ${index + 1} of ${versions.length}`);
              });
          })
          .catch(e => {
            console.error(`Failed to update project version: ${version.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve());
    });
}

export function down(knex) {
  return Promise.resolve();
}
