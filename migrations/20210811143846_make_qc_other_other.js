
export function up(knex) {
  return knex.schema.table('rops', table => {
    table.jsonb('regulatory_subpurposes_qc_other').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('rops', table => {
    table.dropColumn('regulatory_subpurposes_qc_other');
  });
}
