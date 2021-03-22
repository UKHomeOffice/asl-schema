const { sample } = require('lodash');
const rops = require('../data/rops.json');

// don't generate rops for these project ids
const nopes = [];

module.exports = {
  populate: knex => {
    return knex('projects')
      .whereIn('status', ['expired', 'revoked'])
      .then(projects => projects.filter(p => !nopes.includes(p.id)))
      .then(projects => {
        const generatedRops = projects.reduce((grops, project) => {
          grops.push({
            projectId: project.id,
            year: new Date(project.status === 'expired' ? project.expiryDate : project.revocationDate).getFullYear(),
            status: sample(['draft', 'submitted'])
          });
          return grops;
        }, []);

        return knex('rops').insert(rops.concat(generatedRops));
      });
  },
  delete: knex => knex('rops').del()
};
