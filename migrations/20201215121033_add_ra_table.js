
export function up(knex) {
  return knex.schema.dropTableIfExists('retrospective_assessments')
    .createTable('retrospective_assessments', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.jsonb('data');
      table.enum('status', ['draft', 'granted', 'submitted']).defaultsTo('draft');
      table.dateTime('deleted');
      table.timestamps(false, true);
    });
}

export function down(knex) {
  return knex.schema.dropTable('retrospective_assessments');
}
