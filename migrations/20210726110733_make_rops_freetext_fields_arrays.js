
exports.up = function(knex) {
  return knex.schema
    .raw('UPDATE rops SET "basic_subpurposes_other" = to_json("basic_subpurposes_other")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other" = to_json("regulatory_subpurposes_other")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other_efficacy" = to_json("regulatory_subpurposes_other_efficacy")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other_toxicity" = to_json("regulatory_subpurposes_other_toxicity")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other_toxicity_ecotoxicity" = to_json("regulatory_subpurposes_other_toxicity_ecotoxicity")')
    .raw('UPDATE rops SET "regulatory_legislation_other" = to_json("regulatory_legislation_other")')
    .raw('UPDATE rops SET "translational_subpurposes_other" = to_json("translational_subpurposes_other")')
    .alterTable('rops', table => {
      table.jsonb('basic_subpurposes_other').nullable().alter();
      table.jsonb('regulatory_subpurposes_other').nullable().alter();
      table.jsonb('regulatory_subpurposes_other_efficacy').nullable().alter();
      table.jsonb('regulatory_subpurposes_other_toxicity').nullable().alter();
      table.jsonb('regulatory_subpurposes_other_toxicity_ecotoxicity').nullable().alter();
      table.jsonb('regulatory_legislation_other').nullable().alter();
      table.jsonb('translational_subpurposes_other').nullable().alter();
    })
    .table('procedures', table => {
      table.uuid('subpurpose_other').nullable();
      table.uuid('legislation_other').nullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('procedures', table => {
      table.dropColumn('subpurpose_other');
      table.dropColumn('legislation_other');
    })
    .alterTable('rops', table => {
      table.string('translational_subpurposes_other').nullable().alter();
      table.string('regulatory_legislation_other').nullable().alter();
      table.string('regulatory_subpurposes_other_toxicity_ecotoxicity').nullable().alter();
      table.string('regulatory_subpurposes_other_toxicity').nullable().alter();
      table.string('regulatory_subpurposes_other_efficacy').nullable().alter();
      table.string('regulatory_subpurposes_other').nullable().alter();
      table.string('basic_subpurposes_other').nullable().alter();
    })
    .raw('UPDATE rops SET "translational_subpurposes_other" = trim(BOTH \'"\' FROM "translational_subpurposes_other")')
    .raw('UPDATE rops SET "regulatory_legislation_other" = trim(BOTH \'"\' FROM "regulatory_legislation_other")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other_toxicity_ecotoxicity" = trim(BOTH \'"\' FROM "regulatory_subpurposes_other_toxicity_ecotoxicity")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other_toxicity" = trim(BOTH \'"\' FROM "regulatory_subpurposes_other_toxicity")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other_efficacy" = trim(BOTH \'"\' FROM "regulatory_subpurposes_other_efficacy")')
    .raw('UPDATE rops SET "regulatory_subpurposes_other" = trim(BOTH \'"\' FROM "regulatory_subpurposes_other")')
    .raw('UPDATE rops SET "basic_subpurposes_other" = trim(BOTH \'"\' FROM "basic_subpurposes_other")');
};
