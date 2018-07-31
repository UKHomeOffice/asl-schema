exports.seed = function(knex, Promise) {
  return knex('permissions').del()
    .then(function () {
      knex('profiles').where({
        firstName: 'Leonard',
        lastName: 'Martin'
      })
        .then(profiles => {
          const profileId = profiles[0].id;
          console.log(profileId);
          return knex('permissions')
            .insert([
              { establishmentId: 8201, profileId, role: 'admin' }
            ])
            .then(() => {
              return knex('profiles').whereNot({
                firstName: 'Leonard',
                lastName: 'Martin'
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
            });
        });

    });
};
