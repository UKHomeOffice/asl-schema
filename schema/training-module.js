const { UUID, UUIDV1, STRING, DATEONLY, TEXT, BOOLEAN } = require('sequelize');

module.exports = db => {

  const TrainingModule = db.define('trainingModule', {
    id: { type: UUID, defaultValue: UUIDV1, primaryKey: true },
    migrated_id: STRING,
    number: STRING,
    pass_date: DATEONLY,
    not_applicable: { type: BOOLEAN, defaultsTo: false },
    accrediting_body: STRING,
    other_accrediting_body: STRING,
    certificate_number: STRING,
    exemption: { type: BOOLEAN, defaultsTo: false },
    exemption_description: TEXT
  });

  return TrainingModule;

};
