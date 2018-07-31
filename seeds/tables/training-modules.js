const { sample } = require('lodash');
const trainingModules = require('../data/training-modules.json');

module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => knex('profiles'))
      .then(profiles => Promise.all(trainingModules.map(trainingModule => {
        return knex('trainingModules').insert({
          ...trainingModule,
          profileId: sample(profiles).id
        });
      })));
  },
  delete: knex => knex('trainingModules').del()
};
