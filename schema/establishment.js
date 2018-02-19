const { STRING, ENUM, DATE, BOOLEAN, TEXT } = require('sequelize');

module.exports = db => {

  const Establishment = db.define('establishment', {

    id: { type: STRING, primaryKey: true },
    migrated_id: STRING,
    name: { type: STRING, allowNull: false },
    type: STRING,
    status: { type: ENUM('active', 'pending', 'inactive', 'expired', 'revoked'), defaultsTo: 'inactive' },
    issueDate: DATE,
    revocationDate: DATE,
    licenceNumber: STRING,

    country: { type: ENUM('england', 'scotland', 'wales', 'ni'), allowNull: false },
    address: { type: STRING, allowNull: false },
    email: { type: STRING, allowNull: false },

    procedure: { type: BOOLEAN, defaultsTo: false },
    breeding: { type: BOOLEAN, defaultsTo: false },
    supplying: { type: BOOLEAN, defaultsTo: false },
    killing: { type: BOOLEAN, defaultsTo: false },
    rehomes: { type: BOOLEAN, defaultsTo: false },

    conditions: TEXT

  });

  return Establishment;

};
