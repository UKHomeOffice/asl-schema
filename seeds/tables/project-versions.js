const projectVersions = require('../data/project-versions.json');

module.exports = {
  populate: knex => {
    return projectVersions
      .reverse()
      .reduce((p, projectVersion) => {
        return p.then(() => knex('projectVersions').insert(projectVersion));
      }, Promise.resolve());
  },
  delete: knex => knex('projectVersions').del()
};
