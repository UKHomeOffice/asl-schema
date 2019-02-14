const { omit } = require('lodash');
const projectVersions = require('../data/project-versions.json');

module.exports = {
  populate: knex => projectVersions.reverse()
    .map(pv => ({
      ...omit(pv, 'submitted', 'granted'),
      submittedAt: pv.submitted ? new Date().toISOString() : null,
      grantedAt: pv.granted ? new Date().toISOString() : null
    }))
    .reduce((p, projectVersion) => {
      return p.then(() => knex('projectVersions').insert(projectVersion));
    }, Promise.resolve()),
  delete: knex => knex('projectVersions').del()
};
