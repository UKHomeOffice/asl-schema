
exports.up = function(knex) {
  return knex.schema
    .createTable('rops', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('project_id').references('id').inTable('projects').notNull();
      table.enum('status', ['draft', 'granted', 'submitted']).defaultsTo('draft');

      table.boolean('procedures_completed');
      table.boolean('postnatal');

      table.boolean('endangered');
      table.text('endangered_details');

      table.boolean('nmbas');
      table.boolean('general_anaesthesia');
      table.text('general_anaesthesia_details');

      table.boolean('rodenticide');
      table.string('rodenticide_details');

      table.boolean('product_testing');
      table.jsonb('product_testing_types');
      table.jsonb('species');

      table.boolean('reuse');
      table.jsonb('places_of_birth');

      table.boolean('ga');

      table.jsonb('purposes');
      table.jsonb('sub_purposes');

      table.boolean('new_genetic_line');

      table.dateTime('deleted');
      table.timestamps(false, true);
    });
    .createTable('procedures', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('rop_id').references('id').inTable('rops').notNull();

      table.string('species');
      table.boolean('reuse');
      table.string('place_of_birth');
      table.string('ga');
      table.string('purpose');
      table.boolean('new_genetic_line')
      table.jsonb('outcomes');

      table.dateTime('deleted');
      table.timestamps(false, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('procedures')
    .dropTable('rops');
};
