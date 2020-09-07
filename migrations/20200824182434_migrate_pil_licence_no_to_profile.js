exports.up = function(knex) {
  return Promise.resolve()
    // get all profilesIds with a pil
    .then(() => knex('pils').distinct('profile_id'))
    .then(pilProfiles => {
      return pilProfiles.reduce((promise, pilProfile) => {
        return promise
          .then(() => knex('profiles')
            .select('id')
            .where({ id: pilProfile.profile_id })
            .whereNull('pil_licence_number')
            .first()
          )
          .then(profile => {
            // get most recently issued non-deleted pil for profile
            return knex('pils')
              .select('licence_number')
              .where({ profile_id: profile.id })
              .whereNull('deleted')
              .orderBy('issue_date', 'desc')
              .first()
              .then(pil => {
                if (!pil) {
                  return;
                }
                return knex('profiles')
                  .where({ id: profile.id })
                  .update({ pil_licence_number: pil.licence_number });
              });
          });
      }, Promise.resolve());
    });

};

exports.down = function(knex) {
  return knex('profiles').update('pil_licence_number', null);
};
