const VERSION_ID = '1d0c5825-0ba4-4a4f-a0ce-7b83d6983419';

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex('project_versions')
      .select('data')
      .where('id', VERSION_ID)
      .first()
    )
    .then(proj => {
      const field = proj.data['objective-relation'].replace('"marks":[]}]}]}}', '"marks":[]}]}]}]}]}}');

      const data = {
        ...proj.data,
        'objective-relation': field
      };
      return knex('project_versions').where({ id: VERSION_ID }).update({ data });
    });
};

exports.down = function(knex) {
  return Promise.resolve();
};
