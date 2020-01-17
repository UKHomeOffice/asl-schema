
exports.up = function(knex) {
  return knex.raw(`
    grant select on fee_waivers to publicapi;
    grant select on fee_waivers to internalapi;
    grant select on fee_waivers to workflow;
    grant select on fee_waivers to permissions;
    grant select on fee_waivers to notifications;
    grant select,insert,update on fee_waivers to resolver;
  `);
};

exports.down = function(knex) {
  return knex.raw(`
    grant select on fee_waivers to publicapi;
    grant select on fee_waivers to internalapi;
    grant select on fee_waivers to workflow;
    grant select on fee_waivers to permissions;
    grant select on fee_waivers to notifications;
    grant select,insert,update on fee_waivers to resolver;
  `);
};
