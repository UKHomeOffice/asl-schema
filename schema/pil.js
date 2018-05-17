const { STRING, ENUM, DATE, TEXT, UUID, UUIDV1 } = require('sequelize');

module.exports = db => {

  const PIL = db.define('pil', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },

    migrated_id: STRING,
    status: { type: ENUM('active', 'pending', 'inactive', 'expired', 'revoked'), defaultsTo: 'inactive' },
    issueDate: DATE,
    revocationDate: DATE,
    licenceNumber: STRING,
    conditions: TEXT

  });

  return PIL;

};
