const { UUID, UUIDV1, STRING, DATEONLY, TEXT } = require('sequelize');

module.exports = db => {

  const Profile = db.define('profile', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    title: { type: STRING, allowNull: false },
    firstName: { type: STRING, allowNull: false },
    lastName: { type: STRING, allowNull: false },
    dob: DATEONLY,
    qualifications: STRING,
    address: { type: STRING, allowNull: false },
    postcode: { type: STRING, allowNull: false },
    email: { type: STRING, allowNull: false },
    telephone: { type: STRING, allowNull: false },
    notes: TEXT
  });

  return Profile;

};
