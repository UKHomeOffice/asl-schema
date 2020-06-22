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
              ...mapValues(omit(place, 'roles'), (val, key) => {
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

        return knex('roles').whereIn('type', ['nacwo', 'nvs', 'sqp']).where('establishment_id', 8201)
          .then(roles => {
            const placesWithRolesDefined = places.filter(place => place.roles !== undefined);
            const placeIdsWithoutRolesDefined = placeIds.filter(id => !placesWithRolesDefined.find(p => p.id === id));

            const seededPlaceRoles = flatten(placesWithRolesDefined.map(place => {
              if (Array.isArray(place.roles) && !isEmpty(place.roles)) {
                return place.roles.map(roleId => ({
                  role_id: roleId,
                  place_id: place.id
                }));
              }
            })).filter(Boolean);

            const randomPlaceRoles = placeIdsWithoutRolesDefined.map(id => {
              return {
                place_id: id,
                role_id: sample(roles).id
              };
            });

            return knex('place_roles').insert(concat(seededPlaceRoles, randomPlaceRoles));
          });
      });
  },
  delete: knex => knex('places').del()
};
