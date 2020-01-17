
exports.up = function(knex) {
  const grantIfExists = (perms, role) => {
    return knex.raw(`SELECT 1 FROM pg_roles WHERE rolname='${role}'`)
      .then(exists => {
        if (exists.rowCount) {
          return knex.raw(`grant ${perms} on fee_waivers to ${role}`)
        }
      });
  }
  return Promise.resolve()
    .then(() => grantIfExists('select', 'publicapi'))
    .then(() => grantIfExists('select', 'internalapi'))
    .then(() => grantIfExists('select', 'workflow'))
    .then(() => grantIfExists('select', 'notifications'))
    .then(() => grantIfExists('select', 'permissions'))
    .then(() => grantIfExists('select,insert,update', 'resolver'));
};

exports.down = function(knex) {
  const revokeIfExists = (perms, role) => {
    return knex.raw(`SELECT 1 FROM pg_roles WHERE rolname='${role}'`)
      .then(exists => {
        if (exists.rowCount) {
          return knex.raw(`revoke ${perms} on fee_waivers from ${role}`)
        }
      });
  }
  return Promise.resolve()
    .then(() => revokeIfExists('select', 'publicapi'))
    .then(() => revokeIfExists('select', 'internalapi'))
    .then(() => revokeIfExists('select', 'workflow'))
    .then(() => revokeIfExists('select', 'notifications'))
    .then(() => revokeIfExists('select', 'permissions'))
    .then(() => revokeIfExists('select,insert,update', 'resolver'));
};
