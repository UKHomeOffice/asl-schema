const { flatten, values } = require('lodash');
const species = require('../lib/constants/species');
const SPECIES = flatten(values(species));

function fixProtocols(protocols) {
  return protocols.map(protocol => {
    if (!protocol) {
      return protocol;
    }
    const speciesDetails = protocol.speciesDetails;

    if (!speciesDetails || !Array.isArray(speciesDetails)) {
      return protocol;
    }

    const fixedSD = speciesDetails.filter(Boolean).map(s => {
      if (s.name && !s.value) {
        const speciesFromConstants = SPECIES.find(sp => {
          return sp.label === s.name;
        });

        if (speciesFromConstants) {
          s.value = speciesFromConstants.value;
        }
      }
      return s;
    });

    return {
      ...protocol,
      speciesDetails: fixedSD
    };
  });
}

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => {
      return knex
        .select('id')
        .from('projects')
        .where({ 'schema_version': 1 })
    })
    .then(projects => {
      return Promise.all(projects.map(p => {
        return knex
          .select('id', 'data')
          .from('project_versions')
          .where({ 'project_id': p.id })
          .then(versions => {
            const updates = versions.map(version => {
              const data = version.data;

              if (!data) {
                return Promise.resolve();
              }

              const protocols = data.protocols;

              if (!protocols || !protocols.length) {
                console.log(`Skipping version: ${version.id} as no protocols found`);
                return Promise.resolve();
              }

              return knex('project_versions')
                .where({ id: version.id })
                .update({
                  data: {
                    ...data,
                    protocols: fixProtocols(protocols)
                  }
                });
            });

            return Promise.all(updates);
          });
      }));
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
