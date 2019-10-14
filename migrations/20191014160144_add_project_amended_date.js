
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', table => table.dateTime('amended_date'))
  .then(() => {
    return knex.raw(`UPDATE projects p
      SET amended_date = (
          SELECT MAX(pv.updated_at)
          FROM project_versions pv
          WHERE pv.project_id = p.id
          AND pv.status = 'granted'
          GROUP BY pv.project_id
          HAVING COUNT(*) > 1
      )
    `);
  });;
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', table => table.dropColumn('amended_date'));
};
