const { STRING, ENUM, TEXT } = require('sequelize');

module.exports = db => {
  const Authorisation = db.define('authorisation', {
    id: { type: STRING, primaryKey: true },
    type: { type: ENUM('killing', 'rehomes'), allowNull: false },
    method: TEXT,
    description: TEXT
  });

  return Authorisation;
};
