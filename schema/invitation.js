const { STRING } = require('sequelize');

module.exports = db => {

  const Invitation = db.define('invitation', {
    token: STRING
  });

  return Invitation;

};
