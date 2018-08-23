const alterEnumColumn = (tableName, columnName, enums, nullable = true) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      "'::text, '"
    )}'::text]));`,
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} ${nullable ? 'DROP' : 'SET'} NOT NULL`
  ].join('\n');
};


exports.up = async function up(knex) {
  await knex.raw(
    alterEnumColumn('establishments', 'country', ['england', 'scotland', 'wales', 'ni'], true)
  );

  await knex.schema.alterTable('establishments', table => {
    table.string('address').nullable().alter();
    table.string('email').nullable().alter();
  });
};

exports.down = async function down(knex) {
  await knex.raw(
    alterEnumColumn('establishments', 'country', ['england', 'scotland', 'wales', 'ni'], false)
  );

  await knex.schema.alterTable('establishments', table => {
    table.string('address').notNullable().alter();
    table.string('email').notNullable().alter();
  });
};
