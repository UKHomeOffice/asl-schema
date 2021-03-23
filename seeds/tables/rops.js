const rops = require('../data/rops');

module.exports = {
  populate: knex => knex('rops').insert(rops),
  delete: knex => knex('rops').del()
};
