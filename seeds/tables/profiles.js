import glob from 'glob';
import pkg from 'lodash';
import moment from 'moment';
import fixtureProfiles from '../data/profiles.js';
import path from 'path';

const { omit } = pkg;

async function getDumpedProfiles() {
  const dumpedProfiles = [];
  const files = glob.sync('seeds/data/profiles-*.json');

  // Loop through the files and use require instead of dynamic import
  for (const fileName of files) {
    const filePath = path.resolve(fileName); // Resolves the path to avoid issues with `require`

    try {
      // Use require for local files (Node.js CommonJS style)
      const data = require(filePath);
      dumpedProfiles.push(...data);
    } catch (err) {
      console.error(`Error loading file ${filePath}: ${err.message}`);
    }
  }

  return dumpedProfiles;
}

// Merge fixture profiles with dynamically loaded dumped profiles
async function getProfiles() {
  const dumpedProfiles = await getDumpedProfiles();
  return [...fixtureProfiles, ...dumpedProfiles];
}
export default {
  populate: async (knex) => {
    const profiles = await getProfiles();

    for (const profile of profiles) {
      try {
        const profileInsertResult = await knex('profiles')
          .insert(omit({ dob: '1988-09-25', ...profile }, [
            'pil',
            'roles',
            'permissions',
            'projectId',
            'certificates',
            'exemptions',
            'feeWaivers',
            'emailPreferences'
          ]))
          .returning('id');
        const { id: profileId } = profileInsertResult[0];

        // Insert permissions
        if (profile.permissions) {
          await Promise.all(profile.permissions.map(permission =>
            knex('permissions').insert({ ...permission, profileId })
          ));
        }

        // Insert certificates
        if (profile.certificates) {
          await Promise.all(profile.certificates.map(certificate =>
            knex('certificates').insert({
              ...certificate,
              modules: JSON.stringify(certificate.modules || []),
              species: JSON.stringify(certificate.species || []),
              profileId
            })
          ));
        }

        // Insert exemptions
        if (profile.exemptions) {
          await Promise.all(profile.exemptions.map(exemption =>
            knex('exemptions').insert({
              ...exemption,
              species: JSON.stringify(exemption.species || []),
              profileId
            })
          ));
        }

        // Insert PILs (Pilot licenses)
        if (profile.pil && profile.permissions.length) {
          if (!Array.isArray(profile.pil)) {
            profile.pil = [profile.pil];
          }

          for (const pil of profile.pil) {
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

            const pilInsertResult = await knex('pils').insert({
              status: 'active',
              notesCatD,
              notesCatF,
              profileId,
              establishmentId: pil.establishmentId || profile.permissions[0].establishmentId,
              ...omit(pil, 'transfers', 'feeWaivers'),
              procedures: JSON.stringify(procedures),
              species: JSON.stringify(pil.species),
              reviewDate
            }).returning('id');
            const { id: pilId } = pilInsertResult[0];

            // Insert transfers for PIL
            if (pil.transfers) {
              for (const transfer of pil.transfers) {
                await knex('pil_transfers').insert({ ...transfer, pilId });
              }
            }
          }
        }

        // Insert fee waivers
        if (profile.feeWaivers) {
          for (const waiver of profile.feeWaivers) {
            await knex('pil_fee_waivers').insert({ ...waiver, profileId });
          }
        }

        // Insert roles
        if (profile.roles) {
          await Promise.all(profile.roles.map(role =>
            knex('roles').insert({ ...role, profileId })
          ));
        }

        // Insert email preferences
        if (profile.emailPreferences) {
          await knex('emailPreferences').insert({ ...profile.emailPreferences, profileId });
        }
      } catch (error) {
        console.error('Error populating profile:', error);
        throw error; // Re-throwing so the outer function can catch it if needed
      }
    }
  },

  delete: async (knex) => {
    try {
      await knex('pil_transfers').del();
      await knex('fee_waivers').del();
      await knex('pil_fee_waivers').del();
      await knex('pils').del();
      await knex('permissions').del();
      await knex('invitations').del();
      await knex('roles').del();
      await knex('asru_establishment').del();
      await knex('profiles').del();
    } catch (error) {
      console.error('Error deleting records:', error);
      throw error; // Re-throwing so it can be handled if needed
    }
  }
};
