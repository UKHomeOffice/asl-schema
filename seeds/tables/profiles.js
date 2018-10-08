const { omit } = require('lodash');
const profiles = require('../data/profiles.json');
const projects = require('../data/projects.json');

module.exports = {
  populate: knex => {
    return Promise.all(
      profiles.map(profile => {
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
                  return knex('pils')
                    .insert({
                      ...profile.pil,
                      establishment_id: profile.permissions[0].establishmentId,
                      profileId,
                      status: 'active'
                    });
                }
              })
              .then(() => {
                if (!profile.projectId) {
                  return;
                }
                return knex('projects')
                  .insert({
                    licenceHolderId: profileId,
                    ...projects.find(p => p.id === profile.projectId)
                  });
              })
              .then(() => {
                if (profile.roles) {
                  return Promise.all(profile.roles.map(role => {
                    return knex('roles').insert({ ...role, profileId });
                  }));
                }
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
