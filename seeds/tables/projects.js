const { omit } = require('lodash');
const projects = require('../data/projects.json');
const getNonRandomProject = require('./utils/get-non-random-item');

const nopes = ['Basic', 'Read', 'Ella', 'Unaffiliated', 'AA'];

module.exports = {
  populate: knex => {
    return Promise.all(
      projects.filter(p => !p.licenceHolderId).map(project => {
        return knex('profiles')
          .leftJoin('permissions', 'permissions.profile_id', 'profiles.id')
          .whereNotIn('firstName', nopes)
          .andWhere('asruUser', false)
          .andWhere('permissions.establishment_id', project.establishmentId)
          .orderBy('email') // apply an ordering on a reliably populated field for consistency
          .then(profiles => {
            return knex('projects')
              .insert({
                licenceHolderId: getNonRandomProject(profiles, project.title),
                ...omit(project, 'additionalEstablishments')
              });
          });
      })
    )
      .then(() => knex('projects').insert(projects.filter(p => p.licenceHolderId).map(p => omit(p, 'additionalEstablishments'))))
      .then(() => knex('projects').where('expiryDate', '<', (new Date()).toISOString()).update({ status: 'expired' }));
  },
  delete: knex => knex('projects').del()
};
