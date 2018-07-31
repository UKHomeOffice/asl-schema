const establishments = require('../data/establishments.json');

module.exports = {
  populate: knex => knex('establishments').insert(establishments),
  delete: knex => knex('establishments').del()
};
