const Authorisation = require('./authorisation');
const Establishment = require('./establishment');
const Permission = require('./permission');
const Invitation = require('./invitation');
const PIL = require('./pil');
const FeeWaiver = require('./fee-waiver');
const PilTransfer = require('./pil-transfer');
const Place = require('./place');
const PlaceRole = require('./place-role');
const Profile = require('./profile');
const ProjectEstablishment = require('./project-establishment');
const Project = require('./project');
const ProjectVersion = require('./project-version');
const RetrospectiveAssessment = require('./retrospective-assessment');
const Role = require('./role');
const Certificate = require('./certificate');
const Exemption = require('./exemption');
const Changelog = require('./changelog');
const AsruEstablishment = require('./asru-establishment');
const ProjectProfile = require('./project-profile');
const TrainingCourse = require('./training-course');
const TrainingPil = require('./training-pil');
const DocumentCache = require('./document-cache');

module.exports = db => ({
  Authorisation: Authorisation.bindKnex(db),
  Establishment: Establishment.bindKnex(db),
  Permission: Permission.bindKnex(db),
  Invitation: Invitation.bindKnex(db),
  PIL: PIL.bindKnex(db),
  PilTransfer: PilTransfer.bindKnex(db),
  FeeWaiver: FeeWaiver.bindKnex(db),
  Place: Place.bindKnex(db),
  PlaceRole: PlaceRole.bindKnex(db),
  Profile: Profile.bindKnex(db),
  Project: Project.bindKnex(db),
  ProjectEstablishment: ProjectEstablishment.bindKnex(db),
  ProjectVersion: ProjectVersion.bindKnex(db),
  Role: Role.bindKnex(db),
  Certificate: Certificate.bindKnex(db),
  Exemption: Exemption.bindKnex(db),
  Changelog: Changelog.bindKnex(db),
  AsruEstablishment: AsruEstablishment.bindKnex(db),
  ProjectProfile: ProjectProfile.bindKnex(db),
  TrainingCourse: TrainingCourse.bindKnex(db),
  TrainingPil: TrainingPil.bindKnex(db),
  DocumentCache: DocumentCache.bindKnex(db),
  RetrospectiveAssessment: RetrospectiveAssessment.bindKnex(db)
});
