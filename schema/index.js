const Authorisation = require('./authorisation');
const Establishment = require('./establishment');
const Permission = require('./permission');
const Invitation = require('./invitation');
const PIL = require('./pil');
const Place = require('./place');
const Profile = require('./profile');
const Project = require('./project');
const Role = require('./role');
const TrainingModule = require('./training-module');
const Changelog = require('./changelog');

module.exports = db => ({
  Authorisation: Authorisation.bindKnex(db),
  Establishment: Establishment.bindKnex(db),
  Permission: Permission.bindKnex(db),
  Invitation: Invitation.bindKnex(db),
  PIL: PIL.bindKnex(db),
  Place: Place.bindKnex(db),
  Profile: Profile.bindKnex(db),
  Project: Project.bindKnex(db),
  Role: Role.bindKnex(db),
  TrainingModule: TrainingModule.bindKnex(db),
  Changelog: Changelog.bindKnex(db)
});
