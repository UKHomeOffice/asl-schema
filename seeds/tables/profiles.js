const { omit, sampleSize } = require('lodash');
const profiles = require('../data/profiles.json');

module.exports = {
  populate: knex => {
    return profiles.reduce((promise, profile) => {
      return promise.then(() => {
        return knex('profiles')
          .insert(omit({ dob: '1988-09-25', ...profile }, [
            'pil',
            'roles',
            'permissions',
            'projectId',
            'certificates',
            'exemptions'
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
                if (profile.certificates) {
                  return Promise.all(profile.certificates.map(certificate => knex('certificates').insert({
                    ...certificate,
                    modules: JSON.stringify(certificate.modules || []),
                    species: JSON.stringify(certificate.species || []),
                    profileId
                  })));
                }
              })
              .then(() => {
                if (profile.exemptions) {
                  return Promise.all(profile.exemptions.map(exemption => knex('exemptions').insert({
                    ...exemption,
                    species: JSON.stringify(exemption.species || []),
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
                        const procedures = pil.procedures || sampleSize(['B', 'C', 'D', 'F'], Math.ceil(4 * Math.random()));
                        const notesCatD = procedures.includes('D') ? (pil.notesCatD || 'Cat D notes') : null;
                        const notesCatF = procedures.includes('F') ? (pil.notesCatF || 'Cat F notes') : null;
                        return knex('pils').insert({
                          status: 'active',
                          notesCatD,
                          notesCatF,
                          profileId,
                          establishmentId: profile.permissions[0].establishmentId,
                          ...omit(pil, 'transfers'),
                          procedures: JSON.stringify(procedures),
                          species: JSON.stringify(pil.species)
                        }).returning('id');
                      })
                      .then(([ pilId ]) => {
                        if (pil.transfers) {
                          pil.transfers.reduce((promise, transfer) => {
                            return promise
                              .then(() => {
                                return knex('pil_transfers').insert({
                                  ...transfer,
                                  pilId
                                });
                              });
                          }, Promise.resolve())
                        }
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
  delete: knex => knex('pil_transfers').del()
    .then(() => knex('pils').del())
    .then(() => knex('permissions').del())
    .then(() => knex('invitations').del())
    .then(() => knex('roles').del())
    .then(() => knex('asru_establishment').del())
    .then(() => knex('profiles').del())
};
