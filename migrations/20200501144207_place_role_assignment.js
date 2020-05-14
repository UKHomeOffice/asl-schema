
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('place_roles')
    .createTable('place_roles', table => {
      table.uuid('place_id').references('id').inTable('places').notNull();
      table.uuid('role_id').references('id').inTable('roles').notNull();
      table.dateTime('deleted');
      table.timestamps(false, true);
    })
    .then(() => {
      return knex.schema.raw(
        `CREATE UNIQUE INDEX "place_roles_place_id_role_id_deleted_notnull_unique"
        ON "place_roles" ("place_id", "role_id", "deleted")
        WHERE "deleted" IS NOT NULL`
      );
    })
    .then(() => {
      return knex.schema.raw(
        `CREATE UNIQUE INDEX "place_roles_place_id_role_id_deleted_isnull_unique"
        ON "place_roles" ("place_id", "role_id")
        WHERE "deleted" IS NULL`
      );
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('place_roles');
};
