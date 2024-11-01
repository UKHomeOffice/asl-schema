export function up(knex) {
  return knex('places')
    .select('id AS place_id', 'nacwo_id AS role_id')
    .whereNotNull('nacwo_id')
    .then(nacwoAssignments => {
      if (nacwoAssignments.length > 0) {
        return knex('place_roles').insert(nacwoAssignments);
      }
    });
}

export function down(knex) {
  return knex('place_roles').truncate();
}
