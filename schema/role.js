const { UUID, UUIDV1, ENUM, STRING } = require('sequelize');

const ROLES = ENUM(
  'elh',
  'nacwo',
  'nvs',
  'nio',
  'ntco',
  'holc'
);

module.exports = db => {

  const Role = db.define('role', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: { type: STRING, unique: true },
    type: ROLES
  });

  return Role;

};
