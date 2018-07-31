const { omit, pick } = require('lodash');
const profiles = require('../data/profiles.json');

module.exports = {
  populate: knex => {
    return Promise.all(
      profiles.map(profile => {
        return knex('profiles')
          .insert(omit(profile, ['conditions', 'establishmentId', 'issueDate', 'licenceNumber', 'roles']))
          .returning('id')
          .then(ids => ids[0])
          .then(profileId => {
            return Promise.resolve()
              .then(() => {
                const est = [].concat(profile.establishmentId).filter(Boolean);
                return Promise.all(est.map(establishmentId => knex('permissions').insert({ establishmentId, profileId })));
              })
              .then(() => {
                if (!profile.licenceNumber) {
                  return;
                }
                return knex('pils')
                  .insert({
                    profileId,
                    status: 'active',
                    ...pick(profile, ['conditions', 'establishmentId', 'issueDate', 'licenceNumber'])
                  });
              })
              .then(() => {
                const roles = [].concat(profile.roles).filter(Boolean);
                return Promise.all(roles.map(role => {
                  return knex('roles').insert({ ...role, profileId });
                }));
              });
          });
      })
    );
  },
  delete: knex => knex('pils').del()
    .then(() => knex('permissions').del())
    .then(() => knex('roles').del())
    .then(() => knex('profiles').del())
};
