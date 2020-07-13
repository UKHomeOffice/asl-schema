const { isRequired } = require('../lib/retrospective-assessment');

function raCompulsory(version) {
  if (!version || !version.data) {
    return false;
  }
  return isRequired(version.data);
}

exports.raCompulsory = raCompulsory;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex('project_versions')
        .select('id');
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
                if (!raCompulsory(version)) {
                  return Promise.resolve();
                }
                return knex('project_versions')
                  .where({ id: version.id })
                  .update({ ra_compulsory: true });
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
