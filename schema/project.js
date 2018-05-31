const { STRING, ENUM, DATE, UUID, UUIDV1 } = require('sequelize');

module.exports = db => {

  const Project = db.define('project', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    status: { type: ENUM('active', 'pending', 'inactive', 'expired', 'revoked'), defaultsTo: 'inactive' },
    title: { type: STRING, allowNull: false },
    issueDate: DATE,
    expiryDate: DATE,
    revocationDate: DATE,
    licenceNumber: STRING
  });

  return Project;

};
