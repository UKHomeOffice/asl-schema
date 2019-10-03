const { sample, sampleSize } = require('lodash');
const projects = require('../data/projects.json');

const nopes = ['Basic', 'Read', 'Ella', 'Unaffiliated'];

module.exports = {
  populate: knex => {
    return Promise.all(
      projects.filter(p => !p.licenceHolderId).map(project => {
        return knex('profiles')
          .leftJoin('permissions', 'permissions.profile_id', 'profiles.id')
          .whereNotIn('firstName', nopes)
          .andWhere('asruUser', false)
          .andWhere('permissions.establishment_id', project.establishmentId)
          .then(profiles => {
            return knex('projects')
              .insert({
                licenceHolderId: sample(profiles).id,
                ...project
              });
          });
      })
    )
      .then(() => knex('projects').insert(projects.filter(p => p.licenceHolderId)))
      .then(() => knex('projects').where('expiryDate', '<', (new Date()).toISOString()).update({ status: 'expired' }));
  },
  populateList: knex => {
    const projectsList = sampleSize(projects.filter(p => !p.id), 5);
    return Promise.all(
      projectsList.map(project => {
        return knex('profiles')
          .leftJoin('permissions', 'permissions.profile_id', 'profiles.id')
          .whereNotIn('firstName', nopes)
          .andWhere('asruUser', false)
          .andWhere('permissions.establishment_id', project.establishmentId)
          .first()
          .then(profile => {
            return knex('projects')
              .where('licenceNumber', project.licenceNumber)
              .update({ licenceHolderId: profile.id });
          });
      })
    );
  },
  delete: knex => knex('projects').del()
};
