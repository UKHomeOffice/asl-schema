const crypto = require('crypto');

function generateLicenceNumber(knex) {
  const buf = crypto.randomBytes(48).toString('hex');
  const digits = buf.replace(/[a-z]/g, '').substring(0, 8);
  const pilLicenceNumber = `I${digits}`;

  return knex('profiles')
    .where({ pil_licence_number: pilLicenceNumber })
    .first()
    .then(existing => {
      if (existing) {
        return generateLicenceNumber(knex);
      }
      return pilLicenceNumber;
    });
}

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex('profiles').whereNull('pil_licence_number').whereExists(
      knex.select('*').from('pils').whereRaw('profiles.id = pils.profile_id').whereNotIn('status', ['inactive', 'pending'])
    ))
    .then(profiles => {
      console.log(`patching ${profiles.length} profiles`);
      return profiles.reduce((promise, profile) => {
        return promise
          .then(() => generateLicenceNumber(knex))
          .then(licenceNumber => {
            console.log(`Assigning pilLicenceNumber ${licenceNumber} to profile ${profile.id}`);
            return knex('profiles').where('id', profile.id).first().update('pil_licence_number', licenceNumber);
          })
          .then(() => {
            console.log(`Successfully patched ${profile.id}`);
          });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
