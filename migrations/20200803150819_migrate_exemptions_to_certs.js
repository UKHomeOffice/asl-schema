const { uniq } = require('lodash');

function uniqConcat(a, b) {
  return uniq([
    ...(a || []),
    ...(b || [])
  ]);
}

function transform(exemptions) {
  return exemptions.reduce((cert, exemption) => {
    const exemption_reason = cert.exemption_reason || '';
    return {
      species: uniqConcat(cert.species, exemption.species),
      modules: uniqConcat(cert.modules, [exemption.module]),
      exemption_reason: [
        exemption_reason,
        ...(exemption_reason.length ? ['\n'] : []),
        exemption.description
      ].join(''),
      profile_id: exemption.profile_id,
      created_at: exemption.created_at,
      updated_at: exemption.updated_at
    };
  }, {});
}

exports.transform = transform;

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex('exemptions')
        .distinct('profile_id');
    })
    .then(profiles => {
      console.log(`found ${profiles.length} profiles with exemptions`);
      return profiles.reduce((promise, profile) => {
        return promise.then(() => {
          return knex('exemptions')
            .where('profile_id', profile.profile_id)
            .whereNull('deleted')
            .orderBy('created_at', 'asc')
            .then(exemptions => {
              console.log(`found ${exemptions.length} exemptions for profile ${profile.profile_id}`);
              const certificate = transform(exemptions);
              return knex('certificates').insert({
                ...certificate,
                is_exemption: true,
                modules: JSON.stringify(certificate.modules),
                species: JSON.stringify(certificate.species)
              });
            })
            .catch(err => {
              console.log(`Failed combining exemptions for profile ${profile.profile_id}`);
              console.error(err);
            });
        });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return knex('certificates').where('is_exemption', true).delete();
};
