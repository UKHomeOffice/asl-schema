import pkg from 'lodash';
import projects from '../data/projects.js';
import getNonRandomProject from './utils/get-non-random-item.js';

const {omit} = pkg;
const nopes = ['Basic', 'Read', 'Ella', 'Unaffiliated', 'AA'];

export default {
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
                ...omit(project, 'additionalEstablishments', 'collaborators')
              });
          });
      })
    )
      .then(() => knex('projects').insert(projects.filter(p => p.licenceHolderId).map(p => omit(p, 'additionalEstablishments', 'collaborators'))))
      .then(() => {
        return Promise.all(
          projects
            .filter(project => project.collaborators)
            .map(project => {
              return knex('projectProfiles').insert(project.collaborators.map(c => ({ ...c, projectId: project.id })));
            })
        );
      })
      .then(() => knex('projects')
        .where('expiryDate', '<', (new Date()).toISOString())
        .where({ status: 'active' })
        .update({ status: 'expired' })
      );
  },
  delete: knex => knex('projects').del()
};
