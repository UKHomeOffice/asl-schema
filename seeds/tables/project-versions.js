const projectVersions = require('../data/project-versions.json');

module.exports = {
  populate: knex => knex('projectVersions').insert(projectVersions),
  delete: knex => knex('projectVersions').del()
};
