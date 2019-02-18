
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.string('title').nullable().alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', table => {
    table.string('title').notNull().alter();
  });
};
