
exports.up = function(knex) {
  const changeLicenceHolderQuery = () => knex('changelog')
    .where({ model_type: 'project', action: 'update' })
    .orderBy('updated_at', 'desc');

  const previousHolderQuery = changeHolderEvent => knex('changelog')
    .where({ model_type: 'project', model_id: changeHolderEvent.model_id })
    .where('action', '!=', 'update')
    .where('updated_at', '<', changeHolderEvent.updated_at)
    .whereRaw(`state->>'licenceHolderId' != '${changeHolderEvent.state.licenceHolderId}'`)
    .orderBy('updated_at', 'desc')
    .first();

  const updateProjectVersionHolderQuery = fix => knex('project_versions')
    .where({ project_id: fix.projectId })
    .where('updated_at', '<', fix.holderChangedAt)
    .update({ licence_holder_id: fix.holderBefore });

  let fixers = [];
  let nopes = [];

  return Promise.resolve()
    .then(() => changeLicenceHolderQuery())
    .then(changeHolderEvents => {
      const promises = changeHolderEvents.map(changeHolderEvent => {
        return previousHolderQuery(changeHolderEvent).then(previousHolderEvent => {
          if (previousHolderEvent) {
            fixers.push({
              projectId: changeHolderEvent.model_id,
              holderChangedAt: changeHolderEvent.updated_at,
              holderBefore: previousHolderEvent.state.licenceHolderId,
              holderAfter: changeHolderEvent.state.licenceHolderId
            });
          } else {
            nopes.push({
              projectId: changeHolderEvent.model_id,
              holderChangedAt: changeHolderEvent.updated_at,
              holderBefore: undefined,
              holderAfter: changeHolderEvent.state.licenceHolderId
            });
          }
        });
      });

      return Promise.all(promises);
    })
    .then(() => {
      console.log(`found ${fixers.length} change of licence holder to fix`);
      console.log(fixers);
      console.log(`found ${nopes.length} change of licence holder we can't fix`);
      console.log(nopes);

      const promises = fixers.map(fix => updateProjectVersionHolderQuery(fix));

      return Promise.all(promises);
    });
};

exports.down = function(knex) {
  // revert back to the licence holder from the project
  return knex.raw(`
    UPDATE project_versions
    SET licence_holder_id = projects.licence_holder_id
    FROM projects
    WHERE projects.id = project_versions.project_id
  `);
};
