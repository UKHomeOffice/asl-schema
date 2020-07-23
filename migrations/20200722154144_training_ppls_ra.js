
exports.up = function(knex) {
  return knex('project_versions')
    .where({
      ra_compulsory: false
    })
    .whereRaw(`"data" @> '{ "training-licence": true }'`)
    .update({
      ra_compulsory: true
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
