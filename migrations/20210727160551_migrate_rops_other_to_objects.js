const { v4: uuid } = require('uuid');
const { isEmpty, flatten, mapValues } = require('lodash');

const fields = {
  basic_subpurposes: {
    other: 'basic_subpurposes_other'
  },
  regulatory_subpurposes: {
    'routine-other': 'regulatory_subpurposes_other',
    'other-efficacy': 'regulatory_subpurposes_other_efficacy',
    'other-toxicity-ecotoxicity': 'regulatory_subpurposes_other_toxicity_ecotoxicity',
    'other-toxicity': 'regulatory_subpurposes_other_toxicity'
  },
  regulatory_legislation: {
    other: 'regulatory_legislation_other'
  },
  translational_subpurposes: {
    other: 'translational_subpurposes_other'
  }
};

const others = flatten(Object.values(fields).map(f => Object.values(f)));

function transformProc(proc, ropUpdates) {
  if (!proc || !ropUpdates) {
    return null;
  }

  const purpose = proc.purposes;

  if (!purpose) {
    return null;
  }

  if (purpose === 'basic') {
    const subpurpose = proc.basic_subpurposes;
    if (!subpurpose) {
      return null;
    }

    if (subpurpose !== 'other') {
      return null;
    }

    return { subpurpose_other: ropUpdates.basic_subpurposes_other[0].id };
  }

  if (purpose === 'regulatory') {
    const updates = {};
    const subpurpose = proc.regulatory_subpurposes;
    const legislation = proc.regulatory_legislation;
    if (!subpurpose && !legislation) {
      return null;
    }

    const subpurposeField = fields.regulatory_subpurposes[subpurpose];

    if (subpurposeField) {
      updates.subpurpose_other = ropUpdates[subpurposeField][0].id;
    }

    const legislationField = fields.regulatory_legislation[legislation];
    if (legislationField) {
      updates.legislation_other = ropUpdates[legislationField][0].id;
    }

    return updates;
  }

  if (purpose === 'translational') {
    const subpurpose = proc.translational_subpurposes;
    if (!subpurpose) {
      return null;
    }

    if (subpurpose !== 'other') {
      return null;
    }

    return { subpurpose_other: ropUpdates.translational_subpurposes_other[0].id };
  }
}

function transformRop(rop) {
  const updates = others.reduce((obj, key) => {
    const value = rop[key];
    if (typeof value === 'string') {
      return {
        ...obj,
        [key]: [
          {
            id: uuid(),
            value
          }
        ]
      };
    }
    return obj;
  }, {});

  return updates;
}

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex('rops').select('id', ...others))
    .then(rops => {
      return rops.reduce((promise, rop, index) => {
        return promise
          .then(() => {
            const updates = transformRop(rop);
            if (isEmpty(updates)) {
              return Promise.resolve();
            }
            return Promise.resolve()
              .then(() => knex('rops').where({ id: rop.id }).update(mapValues(updates, value => JSON.stringify(value))))
              .then(() => knex('procedures').where({ rop_id: rop.id }))
              .then(procs => {
                return procs.reduce((procPromise, proc) => {
                  return procPromise
                    .then(() => {
                      const procUpdates = transformProc(proc, updates, rop);
                      if (isEmpty(procUpdates)) {
                        return Promise.resolve();
                      }
                      return knex('procedures').update(procUpdates).where({ id: proc.id });
                    });
                }, Promise.resolve());
              });
          });
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};

exports.transformRop = transformRop;
exports.transformProc = transformProc;
