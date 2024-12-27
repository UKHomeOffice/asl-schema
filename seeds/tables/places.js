import { v4 as uuid } from 'uuid';
import pkg from 'lodash';
import {suitabilityCodes, holdingCodes} from '@ukhomeoffice/asl-constants';
import getNonRandomRole from './utils/get-non-random-item.js';
import placesData from '../data/places.js';

const {mapValues, omit, flatten, isEmpty, concat} = pkg;

// Mapping over the places data after importing
const places = placesData.map((p) => ({
  id: uuid(),
  ...p
}));

export default {
  populate: (knex) => {
    return Promise.resolve()
      .then(() => {
        return Promise.all(
          places.map((place) => {
            place.holding = place.holding || holdingCodes.slice(1, 2);
            place.suitability =
              place.suitability || suitabilityCodes.slice(1, 2);
            return knex('places').insert({
              ...mapValues(omit(place, 'roles'), (val, key) => {
                if (key === 'holding' || key === 'suitability') {
                  return JSON.stringify(val);
                }
                return val;
              })
            });
          })
        );
      })
      .then(() => {
        return knex('roles')
          .select('roles.*')
          .join('profiles', 'roles.profile_id', '=', 'profiles.id')
          .whereIn('type', ['nacwo', 'nvs', 'sqp'])
          .where('establishment_id', 8201)
          .orderBy(['profiles.email', 'roles.type'])
          .then((roles) => {
            const croydonPlaces = places.filter(
              (place) => place.establishmentId === 8201
            );
            const placesWithRolesDefined = croydonPlaces.filter(
              (place) => place.roles !== undefined
            );
            const placesWithoutRolesDefined = croydonPlaces.filter(
              (place) => !place.roles
            );

            const seededPlaceRoles = flatten(
              placesWithRolesDefined.map((place) => {
                if (Array.isArray(place.roles) && !isEmpty(place.roles)) {
                  return place.roles.map((roleId) => ({
                    role_id: roleId,
                    place_id: place.id
                  }));
                }
              })
            ).filter(Boolean);

            const randomPlaceRoles = placesWithoutRolesDefined.map((place) => {
              return {
                place_id: place.id,
                role_id: getNonRandomRole(roles, place.name)
              };
            });

            const placeRoles = concat(seededPlaceRoles, randomPlaceRoles);

            if (placeRoles.length > 0) {
              return knex('place_roles').insert(placeRoles);
            }
          });
      });
  },
  delete: (knex) => knex('places').del()
};
