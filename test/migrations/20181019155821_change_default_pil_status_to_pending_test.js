import assert from 'assert';
import knex from 'knex';
import { up } from '../../migrations/20181019155821_change_default_pil_status_to_pending.mjs';

describe('Change Default Pils Status Migration', () => {
  const db = knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'test-password',
      database: 'asl-test'
    }
  });

  before(async () => {
    await db.raw('DROP TABLE IF EXISTS pils CASCADE');
    await db.schema.createTable('pils', (table) => {
      table.string('status');
    });
  });

  after(async () => {
    await db.schema.dropTableIfExists('pils');
    await db.destroy();
  });

  describe('up migration', () => {
    it('should alter the type column with specific enums and set default to null', async () => {
      await up(db); // Run the up migration

      // Query information_schema to verify the ENUM types
      const result = await db.raw(`
        SELECT pg_type.typname AS enum_type
        FROM pg_type
        JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid
        WHERE typname = 'roles_type';
      `);

      const enumValues = result.rows.map(row => row.enum_type);
      const expectedEnums = ['pelh', 'nacwo', 'nvs', 'sqp', 'nio', 'ntco', 'nprc', 'holc'];

      // Check if all expected enum values are present
      expectedEnums.forEach(enumValue => {
        assert(enumValues.includes(enumValue), `Expected enum ${enumValue} to be in type`);
      });

      // Check default is null
      const defaultResult = await db.raw(`
        SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'roles' AND column_name = 'type';
      `);
      assert.strictEqual(defaultResult.rows[0].column_default, null, 'Expected default to be null');
    });
  });
});
