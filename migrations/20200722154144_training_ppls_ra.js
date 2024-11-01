
export function up(knex) {
  return knex('project_versions')
    .where({
      ra_compulsory: false
    })
    .whereRaw(`"data" @> '{ "training-licence": true }'`)
    .update({
      ra_compulsory: true
    });
}

export function down(knex) {
  return Promise.resolve();
}
