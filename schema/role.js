const { UUID, UUIDV1, ENUM } = require('sequelize');

module.exports = db => {

  const Role = db.define('role', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    type: ENUM('elh', 'nacwo')
  });

  return Role;

};
