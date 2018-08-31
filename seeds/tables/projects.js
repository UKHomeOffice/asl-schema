const { sample, sampleSize } = require('lodash');
const projects = require('../data/projects.json');

module.exports = {
  populate: knex => {
    return Promise.all(
      projects.map(project => {
        return knex('profiles').then(profiles => {
          return knex('projects').insert({
            licenceHolderId: sample(profiles).id,
            ...project
          });
        });
      })
    );
  },
  populateList: knex => {
    const projectsList = sampleSize(projects, 5);
    return Promise.all(
      projectsList.map(project => {
        return knex('profiles')
          .first()
          .then(profile => {
            return knex('projects')
              .where('licenceNumber', project.licenceNumber)
              .update({ licenceHolderId: profile.id });
          });
      })
    );
  },
  delete: knex => knex('projects').del()
};
