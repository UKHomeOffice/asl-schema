const { STRING, ENUM, DATE, TEXT } = require('sequelize');

module.exports = db => {

  const PIL = db.define('pil', {

    id: { type: STRING, primaryKey: true },
    migrated_id: STRING,
    status: { type: ENUM('active', 'pending', 'inactive', 'expired', 'revoked'), defaultsTo: 'inactive' },
    issueDate: DATE,
    revocationDate: DATE,
    licenceNumber: STRING,
    conditions: TEXT

  });

  return PIL;

};
