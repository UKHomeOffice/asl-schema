const { omit, pick } = require('lodash');
const profiles = require('../data/profiles.json');
const projects = require('../data/projects.json');

module.exports = {
  populate: knex => {
    return Promise.all(
      profiles.map(profile => {
        return knex('profiles')
          .insert(omit(profile, [
            'conditions',
            'issue_date',
            'licence_number',
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
                if (!profile.licence_number) {
                  return;
                }
                return knex('pils')
                  .insert({
                    profile_id: profileId,
                    status: 'active',
                    ...pick(profile, ['conditions', 'establishment_id', 'issue_date', 'licence_number'])
                  });
              })
              .then(() => {
                if (!profile.projectId) {
                  return;
                }
                console.log(profile.projectId);
                return knex('projects')
                  .insert({
                    licenceHolderId: profileId,
                    ...projects.find(p => p.id === profile.projectId)
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
    .then(() => knex('invitations').del())
    .then(() => knex('roles').del())
    .then(() => knex('profiles').del())
};
