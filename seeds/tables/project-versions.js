const projectVersions = require('../data/project-versions.json');

module.exports = {
  populate: knex => projectVersions.reverse().reduce((p, projectVersion) =>
    p.then(() => knex('projectVersions').insert(projectVersion))
    , Promise.resolve()),
  delete: knex => knex('projectVersions').del()
};
