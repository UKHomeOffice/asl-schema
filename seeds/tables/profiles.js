const { omit, pick } = require('lodash');
const profiles = require('../data/profiles.json');

module.exports = {
  populate: knex => {
    return Promise.all(
      profiles.map(profile => {
        return knex('profiles')
          .insert(omit(profile, ['conditions', 'establishmentId', 'issueDate', 'licenceNumber']))
          .returning('id')
          .then(pId => {
            if (!profile.licenceNumber) {
              return;
            }
            return knex('pils')
              .insert({
                profileId: pId[0],
                status: 'active',
                ...pick(profile, ['conditions', 'establishmentId', 'issueDate', 'licenceNumber'])
              });
          });
      })
    );
  },
  delete: knex => knex('profiles').del()
};
