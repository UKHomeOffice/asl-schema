const projectVersions = require('../data/project-versions');
const { merge } = require('lodash');
const uuid = require('uuid/v4');

const defaults = {
  'poles': false,
  'protocols': [
    {
      'id': uuid(),
      'steps': [
        {
          'id': uuid()
        }
      ],
      'speciesDetails': []
    }
  ],
  'objectives': [
    {
      'id': uuid()
    }
  ],
  'aims-complete': true,
  'purpose-bred': false,
  'wild-animals': false,
  'feral-animals': false,
  'poles-complete': true,
  'funding-complete': true,
  'benefits-complete': true,
  'strategy-complete': true,
  'transfer-expiring': false,
  'clinical-condition': false,
  'endangered-animals': false,
  'protocols-complete': true,
  'reduction-complete': true,
  'experience-complete': true,
  'nts-review-complete': true,
  'experience-projects': true,
  'refinement-complete': true,
  'action-plan-complete': true,
  'commercial-slaughter': false,
  'other-establishments': false,
  'replacement-complete': true,
  'introduction-complete': true,
  'feral-animals-complete': true,
  'nmbas-complete': true,
  'project-harms-complete': true,
  'establishments-complete': true,
  'fate-of-animals-complete': true,
  'experimental-design-sexes': false,
  'endangered-animals-complete': true,
  'general-principles-complete': true,
  'experimental-design-complete': true,
  'commercial-slaughter-complete': true,
  'experimental-design-repeating': false,
  'purpose-bred-animals-complete': true,
  'establishments-care-conditions': false,
  'scientific-background-complete': true,
  'animals-containing-human-material': false,
  'containing-human-material-complete': true,
  'animals-taken-from-the-wild-complete': true,
  'establishments-care-conditions-justification': null,
  'training-complete': true
};

module.exports = {
  populate: knex => {
    return Promise.resolve()
      .then(() => knex('projects'))
      .then(projects => {
        const missing = projects
          .filter(project => {
            return !projectVersions.find(version => version.projectId === project.id);
          })
          .map(project => {
            return {
              projectId: project.id,
              status: project.status === 'inactive' ? 'draft' : 'granted',
              data: {
                title: project.title
              },
              licenceHolderId: project.licenceHolderId
            };
          });
        // insert one at a time asyncly to force unique ordered creation timestamps
        return [ ...projectVersions, ...missing ]
          .reverse()
          .reduce((p, projectVersion) => {
            projectVersion.data = merge({}, defaults, projectVersion.data);
            projectVersion.licenceHolderId = projectVersion.licenceHolderId || projects.find(p => p.id === projectVersion.projectId).licenceHolderId;
            return p.then(version => knex('projectVersions').insert(projectVersion));
          }, Promise.resolve());
      });
  },
  delete: knex => knex('projectVersions').del()
};
