const { ENUM } = require('sequelize');

module.exports = db => {

  const Permission = db.define('permission', {
    role: { type: ENUM('basic', 'read', 'admin'), defaultValue: 'basic', allowNull: false }
  });

  return Permission;

};
