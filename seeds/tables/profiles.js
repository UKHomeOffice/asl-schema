const { omit, sampleSize } = require('lodash');
const profiles = require('../data/profiles.json');

module.exports = {
  populate: knex => {
    return profiles.reduce((promise, profile) => {
      return promise.then(() => {
        return knex('profiles')
          .insert(omit(profile, [
            'pil',
            'roles',
            'permissions',
            'projectId'
          ]))
          .returning('id')
          .then(ids => ids[0])
          .then(profileId => {
            return Promise.resolve()
              .then(() => {
                if (profile.permissions) {
                  return Promise.all(profile.permissions.map(permission => knex('permissions').insert({
                    ...permission,
                    profileId
                  })));
                }
              })
              .then(() => {
                if (profile.pil && profile.permissions.length) {
                  if (!Array.isArray(profile.pil)) {
                    profile.pil = [profile.pil];
                  }
                  return profile.pil.reduce((promise, pil) => {
                    return promise
                      .then(() => {
                        const procedures = pil.procedures || sampleSize(['A', 'B', 'C', 'D', 'F'], Math.ceil(5 * Math.random()));
                        const notesCatD = procedures.includes('D') ? (pil.notesCatD || 'Cat D notes') : null;
                        const notesCatF = procedures.includes('F') ? (pil.notesCatF || 'Cat F notes') : null;
                        return knex('pils').insert({
                          status: 'active',
                          ...pil,
                          procedures: JSON.stringify(procedures),
                          notesCatD,
                          notesCatF,
                          establishmentId: profile.permissions[0].establishmentId,
                          profileId
                        });
                      });
                  }, Promise.resolve());
                }
              })
              .then(() => {
                if (profile.roles) {
                  return Promise.all(profile.roles.map(role => {
                    return knex('roles').insert({ ...role, profileId });
                  }));
                }
              });
          });
      });
    }, Promise.resolve());
  },
  delete: knex => knex('pils').del()
    .then(() => knex('permissions').del())
    .then(() => knex('invitations').del())
    .then(() => knex('roles').del())
    .then(() => knex('asru_establishment').del())
    .then(() => knex('profiles').del())
};
