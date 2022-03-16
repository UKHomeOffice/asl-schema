const enforcementCases = require('../data/enforcement-cases');

module.exports = {
  populate: knex => knex('enforcement_cases').insert(enforcementCases),
  delete: knex => knex('enforcement_cases').del()
};
