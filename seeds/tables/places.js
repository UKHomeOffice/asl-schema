const { sample, mapValues, sampleSize, omit, flatten, isEmpty, concat } = require('lodash');
const { suitabilityCodes, holdingCodes } = require('@asl/constants');
const places = require('../data/places.json');

module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => {
        return Promise.all(places.map(place => {
          place.holding = place.holding || sampleSize(holdingCodes, 2);
          place.suitability = place.suitability || sampleSize(suitabilityCodes, 2);
          return knex('places')
            .insert({
              ...mapValues(omit(place, 'nacwos'), (val, key) => {
                if (key === 'holding' || key === 'suitability') {
                  return JSON.stringify(val);
                }
                return val;
              })
            });
        }));
      })
      .then(() => knex('places').select('id'))
      .then(placeIds => {
        placeIds = placeIds.map(p => p.id);

        return knex('roles').where('type', 'nacwo').where('establishment_id', 8201)
          .then(nacwos => {
            const placesWithNacwosDefined = places.filter(place => place.nacwos !== undefined);
            const placeIdsWithoutNacwosDefined = placeIds.filter(id => !placesWithNacwosDefined.find(p => p.id === id));

            const seededPlaceRoles = flatten(placesWithNacwosDefined.map(place => {
              if (Array.isArray(place.nacwos) && !isEmpty(place.nacwos)) {
                return place.nacwos.map(nacwoRoleId => ({
                  role_id: nacwoRoleId,
                  place_id: place.id
                }));
              }
            })).filter(Boolean);

            const randomPlaceRoles = placeIdsWithoutNacwosDefined.map(id => {
              return {
                place_id: id,
                role_id: sample(nacwos).id
              };
            });

            return knex('place_roles').insert(concat(seededPlaceRoles, randomPlaceRoles));
          });
      });
  },
  delete: knex => knex('places').del()
};
