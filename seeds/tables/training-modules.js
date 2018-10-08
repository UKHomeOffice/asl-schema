const { sample, mapValues } = require('lodash');
const trainingModules = require('../data/training-modules.json');

module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => knex('profiles'))
      .then(profiles => Promise.all(trainingModules.map(trainingModule => {
        return knex('training_modules').insert({
          profileId: sample(profiles).id,
          ...mapValues(trainingModule, (val, key) => {
            if (key === 'species') {
              return JSON.stringify(val);
            }
            return val;
          })
        });
      })));
  },
  delete: knex => knex('training_modules').del()
};
