const { UUID, UUIDV1, ENUM, STRING } = require('sequelize');

const ROLES = ENUM(
  'pelh',
  'nacwo',
  'nvs',
  'nio',
  'ntco',
  'holc'
);

module.exports = db => {

  const Role = db.define('role', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    type: ROLES
  });

  return Role;

};
