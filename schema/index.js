const Authorisation = require('./authorisation');
const Establishment = require('./establishment');
const Permission = require('./permission');
const Invitation = require('./invitation');
const PIL = require('./pil');
const PilTransfer = require('./pil-transfer');
const Place = require('./place');
const Profile = require('./profile');
const Project = require('./project');
const ProjectVersion = require('./project-version');
const Role = require('./role');
const Certificate = require('./certificate');
const Exemption = require('./exemption');
const Changelog = require('./changelog');
const AsruEstablishment = require('./asru-establishment');

module.exports = db => ({
  Authorisation: Authorisation.bindKnex(db),
  Establishment: Establishment.bindKnex(db),
  Permission: Permission.bindKnex(db),
  Invitation: Invitation.bindKnex(db),
  PIL: PIL.bindKnex(db),
  PilTransfer: PilTransfer.bindKnex(db),
  Place: Place.bindKnex(db),
  Profile: Profile.bindKnex(db),
  Project: Project.bindKnex(db),
  ProjectVersion: ProjectVersion.bindKnex(db),
  Role: Role.bindKnex(db),
  Certificate: Certificate.bindKnex(db),
  Exemption: Exemption.bindKnex(db),
  Changelog: Changelog.bindKnex(db),
  AsruEstablishment: AsruEstablishment.bindKnex(db)
});
