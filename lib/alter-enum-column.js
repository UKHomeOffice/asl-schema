module.exports = (tableName, columnName, enums, defaultVal = null, nullable = true) => {
  const constraintName = `${tableName}_${columnName}_check`;
  return [
    `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${constraintName};`,
    `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${columnName} = ANY (ARRAY['${enums.join(
      "'::text, '"
    )}'::text]));`,
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} ${defaultVal ? 'SET DEFAULT \'' + defaultVal + '\'::text' : 'DROP DEFAULT'};`,
    `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} ${nullable ? 'DROP' : 'SET'} NOT NULL;`
  ].join('\n');
};
