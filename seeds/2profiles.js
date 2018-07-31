const { omit, pick } = require('lodash');
const profiles = require('./data/profiles.json');

exports.seed = function(knex, Promise) {
  return knex('profiles').del()
    .then(() => {
      Promise.all([
        profiles.map(profile => {
          return knex('profiles')
            .insert(omit(profile, ['conditions', 'establishmentId', 'issueDate', 'licenceNumber']))
            .returning('id')
            .then(pId => {
              if (!profile.licenceNumber) {
                return Promise.resolve();
              }
              return knex('pils')
                .insert({
                  profileId: pId[0],
                  status: 'active',
                  ...pick(profile, ['conditions', 'establishmentId', 'issueDate', 'licenceNumber'])
                });
            });
        })
      ]);
    });
};
