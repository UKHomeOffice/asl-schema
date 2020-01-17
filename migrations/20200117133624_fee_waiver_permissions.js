
exports.up = function(knex) {
  const ensureRoles = (...roles) => {
    return roles.reduce((promise, role) => promise.then(() => ensureRole(role)), Promise.resolve());
  }
  const ensureRole = (role) => {
    return knex.raw(`SELECT 1 FROM pg_roles WHERE rolname='${role}'`)
      .then(exists => {
        if (exists.rowCount === 0) {
          return knex.raw(`create role ${role}`);
        }
      });
  }
  return Promise.resolve()
    .then(() => ensureRoles(
      'publicapi',
      'internalapi',
      'permissions',
      'notifications',
      'workflow',
      'resolver'
    ))
    .then(() => knex.raw(`grant select on fee_waivers to publicapi`))
    .then(() => knex.raw(`grant select on fee_waivers to internalapi`))
    .then(() => knex.raw(`grant select on fee_waivers to permissions`))
    .then(() => knex.raw(`grant select on fee_waivers to notifications`))
    .then(() => knex.raw(`grant select on fee_waivers to workflow`))
    .then(() => knex.raw(`grant select,insert,update on fee_waivers to resolver`));
};

exports.down = function(knex) {
  return Promise.resolve()
    .then(() => knex.raw('revoke select on fee_waivers from publicapi'))
    .then(() => knex.raw('revoke select on fee_waivers from internalapi'))
    .then(() => knex.raw('revoke select on fee_waivers from workflow'))
    .then(() => knex.raw('revoke select on fee_waivers from notifications'))
    .then(() => knex.raw('revoke select on fee_waivers from permissions'))
    .then(() => knex.raw('revoke select,insert,update on fee_waivers from resolver'));
};
