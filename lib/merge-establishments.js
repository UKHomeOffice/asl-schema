const merge = (knex, fromEstablishmentId, toEstablishmentId) => {
  // get profiles not associated with the target establishment
  return knex('profiles')
    .select('id')
    .whereExists(builder => {
      builder.select('id')
        .from('permissions')
        .where('permissions.establishment_id', fromEstablishmentId)
        .whereRaw('permissions.profile_id = profiles.id');
    })
    .whereNotExists(builder => {
      builder.select('id')
        .from('permissions')
        .where('permissions.establishment_id', toEstablishmentId)
        .whereRaw('permissions.profile_id = profiles.id');
    })
    .then(profilesNeedingPerms => {
      if (profilesNeedingPerms.length === 0) {
        return;
      }
      // add basic perms for all profiles not already associated with the target establishment
      const newPerms = profilesNeedingPerms.map(profile => ({
        profile_id: profile.id,
        establishment_id: toEstablishmentId,
        role: 'basic'
      }));

      return knex('permissions')
        .insert(newPerms)
        .then(() => {
          // log the new perms so we can rollback if required
          const mergeLog = newPerms.map(perm => ({
            model_type: 'permissions',
            model_id: perm.profile_id, // we're creating new perms for specific profiles, so use profile id
            from_establishment_id: fromEstablishmentId,
            to_establishment_id: perm.establishment_id
          }));

          return knex('establishment_merge_log').insert(mergeLog);
        });
    })

    .then(() => {
      // move pils to target establishment
      return knex('pils')
        .update({ establishment_id: toEstablishmentId }, ['id']) // returning the affected ids
        .where({ establishment_id: fromEstablishmentId })
        .then(pilsMoved => {
          if (pilsMoved.length === 0) {
            return;
          }
          // log which pils were moved so we can rollback if required
          const mergeLog = pilsMoved.map(pil => ({
            model_type: 'pils',
            model_id: pil.id,
            from_establishment_id: fromEstablishmentId,
            to_establishment_id: toEstablishmentId
          }));
          return knex('establishment_merge_log').insert(mergeLog);
        });
    })

    .then(() => {
      // move projects to target establishment
      return knex('projects')
        .update({ establishment_id: toEstablishmentId }, ['id']) // returning the affected ids
        .where({ establishment_id: fromEstablishmentId })
        .then(projectsMoved => {
          // log which projects were moved so we can rollback if required
          const mergeLog = projectsMoved.map(project => ({
            model_type: 'projects',
            model_id: project.id,
            from_establishment_id: fromEstablishmentId,
            to_establishment_id: toEstablishmentId
          }));
          if (mergeLog.length > 0) {
            return knex.insert(mergeLog).into('establishment_merge_log');
          }
        });
    });
};

const revertMerge = (knex, fromEstablishmentId, toEstablishmentId) => {
  return knex('establishment_merge_log')
    .where({ from_establishment_id: fromEstablishmentId, to_establishment_id: toEstablishmentId })
    .then(mergeLog => {
      const mergedProfileIds = mergeLog.filter(log => log.model_type === 'permissions').map(log => log.model_id);

      const removePermsQuery = knex('permissions')
        .where({ establishment_id: toEstablishmentId })
        .whereIn('profile_id', mergedProfileIds)
        .del();

      const mergedPilIds = mergeLog.filter(log => log.model_type === 'pils').map(log => log.model_id);

      const revertPilsQuery = knex('pils')
        .update({ establishment_id: fromEstablishmentId })
        .whereIn('id', mergedPilIds);

      const mergedProjectIds = mergeLog.filter(log => log.model_type === 'projects').map(log => log.model_id);

      const revertProjectsQuery = knex('projects')
        .update({ establishment_id: fromEstablishmentId })
        .whereIn('id', mergedProjectIds);

      return Promise.all([removePermsQuery, revertPilsQuery, revertProjectsQuery])
        .then(() => {
          // remove the log entries for reverted records
          return knex('establishment_merge_log')
            .whereIn('id', mergeLog.map(log => log.id))
            .del();
        });
    });
};

module.exports = { merge, revertMerge };
