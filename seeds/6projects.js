const { sample } = require('lodash');
const projects = require('./data/projects.json');

exports.seed = knex => {
  return knex('projects').del()
    .then(() => {
      return Promise.all(projects.map(project => {
        return knex('profiles')
          .then(profiles => {
            return knex('projects')
              .insert({
                licenceHolderId: sample(profiles).id,
                ...project
              })
          })
      }))
    });
};
