const { sample } = require('lodash');
const rops = require('../data/rops.json');

module.exports = {
  populate: knex => {
    return knex('projects')
      .whereIn('status', ['expired', 'revoked'])
      .then(projects => {
        const generatedRops = projects.reduce((grops, project) => {
          grops.push({
            projectId: project.id,
            year: new Date(project.status === 'expired' ? project.expiryDate : project.revocationDate).getFullYear(),
            status: sample(['draft', 'submitted'])
          });
          return grops;
        }, []);

        console.log(generatedRops);

        return knex('rops').insert(rops.concat(generatedRops));
      });
  },
  delete: knex => knex('rops').del()
};
