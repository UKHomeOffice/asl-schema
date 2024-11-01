import Attachment from './attachment.js';
import Authorisation from './authorisation.js';
import Establishment from './establishment.js';
import Export from './export.js';
import Permission from './permission.js';
import Invitation from './invitation.js';
import PIL from './pil.js';
import FeeWaiver from './fee-waiver.js';
import PilTransfer from './pil-transfer.js';
import Place from './place.js';
import PlaceRole from './place-role.js';
import Profile from './profile.js';
import ProfileMergeLog from './profile-merge-log.js';
import ProjectEstablishment from './project-establishment.js';
import Project from './project.js';
import ProjectVersion from './project-version.js';
import RetrospectiveAssessment from './retrospective-assessment.js';
import Role from './role.js';
import Certificate from './certificate.js';
import Exemption from './exemption.js';
import Changelog from './changelog.js';
import AsruEstablishment from './asru-establishment.js';
import ProjectProfile from './project-profile.js';
import TrainingCourse from './training-course.js';
import TrainingPil from './training-pil.js';
import DocumentCache from './document-cache.js';
import EmailPreferences from './email-preferences.js';
import Rop from './rop.js';
import Procedure from './procedure.js';
import Notification from './notification.js';
import EnforcementCase from './enforcement-case.js';
import EnforcementSubject from './enforcement-subject.js';
import EnforcementFlag from './enforcement-flag.js';
import Reminder from './reminder.js';
import ReminderDismissed from './reminder-dismissed.js';

export default db => ({
  Attachment: Attachment.bindKnex(db),
  Authorisation: Authorisation.bindKnex(db),
  Establishment: Establishment.bindKnex(db),
  Export: Export.bindKnex(db),
  Permission: Permission.bindKnex(db),
  Invitation: Invitation.bindKnex(db),
  PIL: PIL.bindKnex(db),
  Rop: Rop.bindKnex(db),
  Procedure: Procedure.bindKnex(db),
  PilTransfer: PilTransfer.bindKnex(db),
  FeeWaiver: FeeWaiver.bindKnex(db),
  Place: Place.bindKnex(db),
  PlaceRole: PlaceRole.bindKnex(db),
  Profile: Profile.bindKnex(db),
  ProfileMergeLog: ProfileMergeLog.bindKnex(db),
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
  RetrospectiveAssessment: RetrospectiveAssessment.bindKnex(db),
  EmailPreferences: EmailPreferences.bindKnex(db),
  Notification: Notification.bindKnex(db),
  EnforcementCase: EnforcementCase.bindKnex(db),
  EnforcementSubject: EnforcementSubject.bindKnex(db),
  EnforcementFlag: EnforcementFlag.bindKnex(db),
  Reminder: Reminder.bindKnex(db),
  ReminderDismissed: ReminderDismissed.bindKnex(db)
});
