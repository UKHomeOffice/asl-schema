const enforcementFlags = require('../data/enforcement-flags');

module.exports = {
  populate: knex => knex('enforcement_flags').insert(enforcementFlags),
  delete: knex => knex('enforcement_flags').del()
};
