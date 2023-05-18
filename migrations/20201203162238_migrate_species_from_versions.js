const { uniq, flatten, compact } = require('lodash');
const { projectSpecies } = require('@ukhomeoffice/asl-constants');

const species = flatten(Object.values(projectSpecies));

const legacy = {
  2: 'Amphibians',
  3: 'Animals taken from the wild',
  4: 'Avian Eggs',
  5: 'Birds',
  6: 'Camelids',
  7: 'Cats',
  8: 'Cattle',
  9: 'Cephalopods',
  10: 'Deer',
  11: 'Dogs',
  12: 'Ferrets',
  14: 'Fish - all other fish',
  13: 'Fish - Zebra Fish',
  15: 'Gerbils',
  29: 'Goats',
  16: 'Goats, sheep',
  17: 'Guinea-pigs',
  18: 'Hamsters',
  19: 'Horses',
  20: 'Mice',
  1: 'N/A',
  21: 'Non-human primates - new world (e.g. marmosets)',
  22: 'Non-human primates - old world (e.g. macaques)',
  28: 'Other species',
  23: 'Pigs',
  24: 'Rabbits',
  25: 'Rats',
  26: 'Reptiles',
  27: 'Seals',
  30: 'Sheep'
};

function extract(data) {
  const fields = [
    'species',
    'species-other',
    'species-other-amphibians',
    'species-other-birds',
    'species-other-camelids',
    'species-other-dogs',
    'species-other-domestic-fowl',
    'species-other-equidae',
    'species-other-fish',
    'species-other-nhps',
    'species-other-reptiles',
    'species-other-rodents'
  ];

  return fields
    .reduce((list, key) => {
      return [...list, ...(data[key] || [])];
    }, [])
    .filter((s) => !s.match(/^other-/))
    .map((s) => {
      const coded = species.find((sp) => sp.value === s);
      return coded ? coded.label : s;
    });
}

const extractLegacy = (data) => {
  const protocols = data.protocols || [];
  return protocols
    .reduce((list, protocol) => {
      return [...list, ...(protocol.species || [])];
    }, [])
    .map((s) => {
      if (s.speciesId === '28') {
        return s['other-species-type'];
      }
      return legacy[s.speciesId];
    });
};

function getSpecies(data, { schema_version, id } = {}) {
  try {
    if (schema_version === 0) {
      return compact(uniq(extractLegacy(data)));
    }
    return compact(uniq(extract(data)));
  } catch (e) {
    console.error(`Failed to extract species from project ${id}`);
    console.error(e.stack);
    return [];
  }
}

exports.getSpecies = getSpecies;

exports.up = async function (knex) {
  return Promise.resolve()
    .then(() => {
      return knex('projects')
        .select('id', 'status', 'schema_version')
        .where({ deleted: null });
    })
    .then((projects) => {
      console.log(`found ${projects.length} projects`);
      return projects.reduce((promise, project, index) => {
        return promise
          .then(() => {
            const allowedStatus =
              project.status === 'inactive' ? 'submitted' : 'granted';
            console.log(
              `patching project: ${project.id}, ${index + 1} of ${
                projects.length
              }`
            );
            return knex('project_versions')
              .select('id', 'data')
              .where({ project_id: project.id, status: allowedStatus })
              .orderBy('created_at', 'desc')
              .first()
              .then((version) => {
                if (!version) {
                  return Promise.resolve();
                }
                let species = getSpecies(version.data, project);
                if (!species || !species.length) {
                  species = null;
                }
                return knex('projects')
                  .where({ id: project.id })
                  .update({
                    species: species ? JSON.stringify(species) : species
                  });
              })
              .then(() => {
                console.log(
                  `finshed patching project: ${project.id}, ${index + 1} of ${
                    projects.length
                  }`
                );
              });
          })
          .catch((e) => {
            console.error(`Failed to update project: ${project.id}`);
            console.error(e.stack);
            throw e;
          });
      }, Promise.resolve());
    });
};

exports.down = function (knex) {
  return Promise.resolve();
};
