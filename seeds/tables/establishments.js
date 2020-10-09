const establishments = require('../data/establishments.json');

module.exports = {
  populate: knex => knex('establishments').insert(establishments.reduce((ests, e) => {
    ests.push({
      ...e,
      keywords: JSON.stringify(e.keywords)
    });
    return ests;
  }, [])),
  delete: knex => knex('establishments').del()
};
