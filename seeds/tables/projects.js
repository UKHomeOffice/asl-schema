const { sample } = require('lodash');
const projects = require('../data/projects.json');

module.exports = {
  populate: knex => {
    return Promise.all(
      projects.map(project => {
        return knex('profiles')
          .then(profiles => {
            return knex('projects')
              .insert({
                licenceHolderId: sample(profiles).id,
                ...project
              });
          });
      })
    );
  },
  delete: knex => knex('projects').del()
};
