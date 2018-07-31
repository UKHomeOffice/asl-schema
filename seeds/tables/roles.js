const { omit, pick } = require('lodash');
const roles = require('../data/roles.json');

module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => {
        return Promise.all(roles.map(role => {
          return knex('profiles')
            .insert(omit(role, ['establishmentId', 'type']))
            .returning('id')
            .then(id => {
              return knex('roles').insert({
                profileId: id[0],
                ...pick(role, ['establishmentId', 'type'])
              });
            });
        }));
      })
      .then(() => {
        return knex('profiles').where({
          firstName: 'Leonard',
          lastName: 'Martin'
        });
      })
      .then(pelh => {
        return knex('roles').insert({
          type: 'pelh',
          profileId: pelh[0].id,
          establishmentId: 8201
        });
      });
  },
  delete: knex => knex('roles').del()
};
