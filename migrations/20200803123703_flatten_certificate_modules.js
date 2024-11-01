import pkg from 'lodash';
const {uniq} = pkg;

function transform(certificate) {
  if (!certificate.modules || !certificate.modules.length) {
    return;
  }
  const species = certificate.species || [];
  const speciesFromModules = uniq((certificate.modules || []).reduce((arr, mod) => [ ...arr, ...(mod.species || []) ], []));
  return {
    species: JSON.stringify(uniq([...species, ...speciesFromModules])),
    modules: JSON.stringify(certificate.modules.map(module => module.module || module))
  };
}

export {transform};

export function up(knex) {
  return knex('certificates')
    .select('id', 'species', 'modules')
    .then(certs => {
      return certs.reduce((promise, certificate) => {
        return promise.then(() => {
          const patch = transform(certificate);
          if (!patch) {
            return Promise.resolve();
          }
          return knex('certificates')
            .where('id', certificate.id)
            .update(patch);
        })
          .catch(err => {
            console.error(err);
            console.log(`Error processing ${certificate.id}`);
          });
      }, Promise.resolve());
    });
}

export function down(knex) {
  return Promise.resolve();
}
