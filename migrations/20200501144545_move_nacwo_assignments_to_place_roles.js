
exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex('places').select('id AS place_id', 'nacwo_id AS role_id').whereNotNull('nacwo_id'))
    .then(nacwoAssignments => {
      if (nacwoAssignments.length > 0) {
        return knex('place_roles').insert(nacwoAssignments);
      }
    });
};

exports.down = function(knex) {
  return knex('place_roles').truncate();
  // or alternatively, don't do that
  // return Promise.resolve();
};
