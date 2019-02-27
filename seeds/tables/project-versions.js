const projectVersions = require('../data/project-versions.json');

module.exports = {
  populate: knex => {
    // insert one at a time asyncly to force unique ordered creation timestamps
    return projectVersions
      .reverse()
      .reduce((p, projectVersion) => {
        return p.then(() => knex('projectVersions').insert(projectVersion));
      }, Promise.resolve());
  },
  delete: knex => knex('projectVersions').del()
};
