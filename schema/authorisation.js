const { UUID, UUIDV1, ENUM, TEXT } = require('sequelize');

module.exports = db => {
  const Authorisation = db.define('authorisation', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    type: { type: ENUM('killing', 'rehomes'), allowNull: false },
    method: TEXT,
    description: TEXT
  });

  return Authorisation;
};
