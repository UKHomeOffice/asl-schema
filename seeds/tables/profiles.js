const glob = require('glob');
const { omit } = require('lodash');
const moment = require('moment');

const fixtureProfiles = require('../data/profiles.json');

// Include any saved profiles generated by bin/dump-profiles
const dumpedProfiles = glob.sync('seeds/data/profiles-*.json').reduce((profiles, fileName) => {
  const data = require(fileName.replace('seeds/', '../'));
  return profiles.concat(data);
}, []);

const profiles = fixtureProfiles.concat(dumpedProfiles);

const insertPermissions = async (knex, permissions, profileId) => {
  for (const permission of permissions) {
    console.info('Inserting permission:', permission);
    await knex('permissions').insert({
      ...permission,
      profileId: profileId.id ? profileId.id : profileId
    });
  }
};

const insertCertificates = async (knex, certificates, profileId) => {
  for (const certificate of certificates) {
    console.info('Inserting certificate:', certificate);
    await knex('certificates').insert({
      ...certificate,
      modules: JSON.stringify(certificate.modules || []),
      species: JSON.stringify(certificate.species || []),
      profileId: profileId.id ? profileId.id : profileId
    });
  }
};

const insertExemptions = async (knex, exemptions, profileId) => {
  for (const exemption of exemptions) {
    console.info('Inserting exemption:', exemption);
    await knex('exemptions').insert({
      ...exemption,
      species: JSON.stringify(exemption.species || []),
      profileId: profileId.id ? profileId.id : profileId
    });
  }
};

const insertPils = async (knex, pils, permissions, profileId) => {
  for (const pil of pils) {
    const procedures = pil.procedures || ['B', 'C'];
    const notesCatD = procedures.includes('D') ? (pil.notesCatD || 'Cat D notes') : null;
    const notesCatF = procedures.includes('F') ? (pil.notesCatF || 'Cat F notes') : null;
    let reviewDate = pil.reviewDate;

    if (typeof reviewDate === 'object') {
      const { unit, method, num } = reviewDate;
      reviewDate = moment()[method](num, unit).toISOString();
    } else {
      reviewDate = reviewDate || moment(pil.issueDate).add(5, 'years').toISOString();
    }

    const [pilId] = await knex('pils').insert({
      status: 'active',
      notesCatD,
      notesCatF,
      profileId: profileId.id ? profileId.id : profileId,
      establishmentId: pil.establishmentId || permissions[0].establishmentId,
      ...omit(pil, 'transfers', 'feeWaivers'),
      procedures: JSON.stringify(procedures),
      species: JSON.stringify(pil.species),
      reviewDate
    }).returning('id');

    if (pil.transfers) {
      for (const transfer of pil.transfers) {
        await knex('pil_transfers').insert({
          ...transfer,
          pilId: pilId.id ? pilId.id : pilId
        });
      }
    }
  }
};

const insertRoles = async (knex, roles, profileId) => {
  for (const role of roles) {
    console.info('Inserting role:', role);
    await knex('roles').insert({
      ...role,
      profileId: profileId.id ? profileId.id : profileId
    });
  }
};

const insertFeeWaivers = async (knex, feeWaivers, profileId) => {
  for (const waiver of feeWaivers) {
    console.info('Inserting fee waiver:', waiver);
    await knex('pil_fee_waivers').insert({
      ...waiver,
      profileId: profileId.id ? profileId.id : profileId
    });
  }
};

const insertEmailPreferences = async (knex, emailPreferences, profileId) => {
  console.info('Inserting email preferences:', emailPreferences);
  await knex('emailPreferences').insert({
    ...emailPreferences,
    profileId: profileId.id ? profileId.id : profileId
  });
};

module.exports = {
  populate: async knex => {
    for (const profile of profiles) {
      const [profileId] = await knex('profiles').insert(
        omit({ dob: '1988-09-25', ...profile }, [
          'pil',
          'roles',
          'permissions',
          'projectId',
          'certificates',
          'exemptions',
          'feeWaivers',
          'emailPreferences'
        ])
      ).returning('id');

      if (profile.permissions) {
        await insertPermissions(knex, profile.permissions, profileId);
      }

      if (profile.certificates) {
        await insertCertificates(knex, profile.certificates, profileId);
      }

      if (profile.exemptions) {
        await insertExemptions(knex, profile.exemptions, profileId);
      }

      if (profile.pil) {
        const pils = Array.isArray(profile.pil) ? profile.pil : [profile.pil];
        await insertPils(knex, pils, profile.permissions, profileId);
      }

      if (profile.feeWaivers) {
        await insertFeeWaivers(knex, profile.feeWaivers, profileId);
      }

      if (profile.roles) {
        await insertRoles(knex, profile.roles, profileId);
      }

      if (profile.emailPreferences) {
        await insertEmailPreferences(knex, profile.emailPreferences, profileId);
      }
    }
  },

  delete: async knex => {
    await knex('pil_transfers').del();
    await knex('fee_waivers').del();
    await knex('pil_fee_waivers').del();
    await knex('pils').del();
    await knex('permissions').del();
    await knex('invitations').del();
    await knex('roles').del();
    await knex('asru_establishment').del();
    await knex('profiles').del();
  }
};
