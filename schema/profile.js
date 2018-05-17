const { UUID, UUIDV1, STRING, DATEONLY, TEXT } = require('sequelize');

module.exports = db => {

  const Profile = db.define('profile', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    title: { type: STRING, allowNull: false },
    firstName: { type: STRING, allowNull: false },
    lastName: { type: STRING, allowNull: false },
    dob: DATEONLY,
    position: STRING,
    qualifications: STRING,
    certifications: STRING,
    address: STRING,
    postcode: STRING,
    email: { type: STRING, allowNull: false },
    telephone: { type: STRING, allowNull: false },
    notes: TEXT
  }, {
    getterMethods: {
      name() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  });

  return Profile;

};
