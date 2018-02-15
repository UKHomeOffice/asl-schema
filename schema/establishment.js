const { STRING, ENUM, DATE, BOOLEAN, TEXT } = require('sequelize');

module.exports = db => {

  const Establishment = db.define('establishment', {

    id: { type: STRING, primaryKey: true },
    name: { type: STRING, allowNull: false },
    status: { type: ENUM('active', 'pending', 'inactive', 'expired', 'revoked'), defaultsTo: 'inactive' },
    issued: DATE,
    licenceNumber: STRING,

    country: { type: ENUM('england', 'scotland', 'wales', 'ni'), allowNull: false },
    address: { type: STRING, allowNull: false },
    postcode: { type: STRING, allowNull: false },
    telephone: { type: STRING, allowNull: false },
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
