const { UUID, UUIDV1, STRING } = require('sequelize');

module.exports = db => {

  const Profile = db.define('profile', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    name: STRING,
    email: STRING,
    telephone: STRING
  });

  return Profile;

};
