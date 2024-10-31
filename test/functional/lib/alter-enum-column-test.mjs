import assert from 'assert';
import alterEnumColumn from '../../../lib/alter-enum-column.mjs';

describe('Change Default Pils Status Migration', () => {
  const tableName = 'pils';
  const columnName = 'status';
  const enums = ['active', 'pending', 'inactive', 'expired', 'revoked'];

  describe('alterEnumColumn function', () => {
    it('should create correct SQL for adding a CHECK constraint', () => {
      const expected = [
        `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${tableName}_${columnName}_check;`,
        `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_${columnName}_check CHECK (${columnName} = ANY (ARRAY['active'::text, 'pending'::text, 'inactive'::text, 'expired'::text, 'revoked'::text]));`,
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET DEFAULT 'pending'::text;`,
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP NOT NULL;`
      ].join('\n');

      const actual = alterEnumColumn(tableName, columnName, enums, 'pending', true);
      assert.equal(actual, expected);
    });
  });
});
