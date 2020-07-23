const moment = require('moment');
const { addedByAsru } = require('../lib/retrospective-assessment');

function getRaDate(version, project) {
  if (!version || !project || !version.data) {
    return null;
  }
  if (!version.ra_compulsory && !addedByAsru(version.data)) {
    return null;
  }

  const date = project.status === 'revoked'
    ? project.revocation_date
    : project.expiry_date;

  return moment(date).add(6, 'months').toISOString();
}

exports.getRaDate = getRaDate;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex('projects')
        .select('id', 'expiry_date', 'revocation_date', 'status')
        .whereIn('status', ['active', 'revoked', 'expired'])
        .where({ schema_version: 1 })
        .whereNull('ra_date');
    })
    .then(projects => {
      console.log(`found ${projects.length} projects`);
      return projects.reduce((promise, project, index) => {
        return promise
          .then(() => {
            console.log(`patching project: ${project.id}, ${index + 1} of ${projects.length}`);
            return knex('project_versions')
              .select('id', 'data', 'ra_compulsory')
              .where({ 'project_id': project.id, status: 'granted' })
              .orderBy('created_at', 'desc')
              .first()
              .then(version => {
                const ra_date = getRaDate(version, project);
                if (!ra_date) {
                  return Promise.resolve();
                }
                return knex('projects')
                  .where({ id: project.id })
                  .update({ ra_date });
              })
              .then(() => {
                console.log(`finshed patching project: ${project.id}, ${index + 1} of ${projects.length}`);
              });
          })
          .catch(e => {
            console.error(`Failed to update project: ${project.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
