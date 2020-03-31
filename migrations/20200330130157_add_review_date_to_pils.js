const moment = require('moment');

exports.up = function(knex) {
  return knex
    .select('id', 'updated_at', 'review_date')
    .from('pils')
    .whereNull('review_date')
    .then(pils => {
      return pils.reduce((promise, pil) => {
        const { id, updated_at } = pil;
        const review_date = moment(updated_at).add(5, 'years').toISOString();
        return promise.then(() => {
          return knex('pils')
            .where({ id })
            .update({ review_date })
        })
      }, Promise.resolve());
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
