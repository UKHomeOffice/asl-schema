const { sample, mapValues } = require('lodash');
const places = require('../data/places.json');

module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => knex('roles').where('type', 'nacwo'))
      .then(nacwos => {
        return Promise.all(places.map(place => {
          return knex('places')
            .insert({
              nacwoId: sample(nacwos).id,
              ...mapValues(place, (val, key) => {
                if (key === 'holding' || key === 'suitability') {
                  return JSON.stringify(val);
                }
                return val;
              })
            });
        }));
      });
  },
  delete: knex => knex('places').del()
};
