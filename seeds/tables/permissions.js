module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => {
        return knex('profiles').where({
          firstName: 'Leonard',
          lastName: 'Martin'
        });
      })
      .then(profiles => {
        const profileId = profiles[0].id;
        return knex('permissions')
          .insert({ establishmentId: 8201, profileId, role: 'admin' });
      })
      .then(() => {
        return knex('profiles').whereNot({
          firstName: 'Leonard',
          lastName: 'Martin'
        });
      })
      .then(profiles => {
        return knex('permissions')
          .insert(profiles.map(profile => {
            return {
              establishmentId: 8201,
              profileId: profile.id,
              role: 'read'
            };
          }));
      });
  },
  delete: knex => knex('permissions').del()
};
