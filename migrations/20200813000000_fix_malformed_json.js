const VERSION_ID = '5507ee39-14cd-424e-b6be-c4bb5883294c';

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex('project_versions')
      .select('data')
      .where('id', VERSION_ID)
      .first()
    )
    .then(proj => {
      if (!proj) {
        return Promise.resolve();
      }
      const field = proj.data['objective-relation'].replace('"marks":[]}]}]}}', '"marks":[]}]}]}]}]}}');

      const data = {
        ...proj.data,
        'objective-relation': field
      };
      return knex('project_versions').where({ id: VERSION_ID }).update({ data });
    });
};

exports.down = function(knex) {
  return Promise.resolve()
    .then(() => knex('project_versions')
      .select('data')
      .where('id', VERSION_ID)
      .first()
    )
    .then(proj => {
      if (!proj) {
        return Promise.resolve();
      }
      const field = proj.data['objective-relation'].replace('"marks":[]}]}]}]}]}}', '"marks":[]}]}]}}');

      const data = {
        ...proj.data,
        'objective-relation': field
      };
      return knex('project_versions').where({ id: VERSION_ID }).update({ data });
    });
};
