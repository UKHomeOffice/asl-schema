
exports.up = function(knex) {
  return knex.schema
    .createTable('rops', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.enum('status', ['draft', 'submitted']).defaultsTo('draft');

      table.integer('year').notNull();

      table.boolean('procedures_completed');
      table.boolean('postnatal');

      table.boolean('endangered');
      table.text('endangered_details');

      table.boolean('nmbas');
      table.boolean('general_anaesthesia');
      table.text('general_anaesthesia_details');

      table.boolean('rodenticide');
      table.text('rodenticide_details');

      table.boolean('product_testing');
      table.jsonb('product_testing_types');

      table.boolean('other_species');
      table.jsonb('species');

      table.boolean('reuse');
      table.jsonb('places_of_birth');

      table.text('schedule_two_details');

      table.jsonb('nhps_origin');
      table.jsonb('nhps_colony_status');
      table.jsonb('nhps_generation');

      table.boolean('ga');

      table.jsonb('purposes');

      table.jsonb('basic_subpurposes');
      table.string('basic_subpurposes_other');

      table.jsonb('regulatory_subpurposes');
      table.string('regulatory_subpurposes_other');

      table.jsonb('regulatory_legislation');
      table.string('regulatory_legislation_other');
      table.jsonb('regulatory_legislation_origin');

      table.jsonb('translational_subpurposes');
      table.string('translational_subpurposes_other');

      table.boolean('new_genetic_line');

      table.dateTime('deleted');
      table.timestamps(false, true);
    })
    .createTable('procedures', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('rop_id').references('id').inTable('rops').notNull();

      table.string('species').notNull();
      table.boolean('reuse').nullable();
      table.string('places_of_birth').nullable();
      table.string('nhps_origin');
      table.string('nhps_colony_status');
      table.string('nhps_generation');
      table.string('ga').notNull();

      table.string('purposes').notNull();
      table.string('basic_subpurposes').nullable();
      table.string('regulatory_subpurposes').nullable();
      table.string('regulatory_legislation').nullable();
      table.string('regulatory_legislation_origin').nullable();
      table.string('translational_subpurposes').nullable();

      table.boolean('new_genetic_line').notNull();

      table.string('severity').notNull();
      table.integer('severity_num').notNull();
      table.text('severity_ho_note').nullable();
      table.text('severity_personal_note').nullable();

      table.dateTime('deleted');
      table.timestamps(false, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('procedures')
    .dropTable('rops');
};
