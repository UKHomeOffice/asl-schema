const establishments = require('./data/establishments.json');

exports.seed = knex => {
  return knex('establishments').del()
    .then(() => {
      return knex('establishments').insert(establishments);
    });
};
