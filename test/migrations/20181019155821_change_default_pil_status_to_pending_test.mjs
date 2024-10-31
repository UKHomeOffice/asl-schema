import assert from 'assert';
import knex from 'knex';
import { up, down } from '../../migrations/20181019155821_change_default_pil_status_to_pending.mjs';

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
    it('should alter the status column and set default to pending', async () => {
      await up(db); // Call the up migration

      const result = await db.raw("SELECT column_default FROM information_schema.columns WHERE table_name = 'pils' AND column_name = 'status'");
      assert.equal(result.rows[0].column_default, "'pending'::text", "Default value for status should be 'pending'");

      const checkConstraintResult = await db.raw("SELECT conname FROM pg_constraint WHERE conname = 'pils_status_check'");
      assert.equal(checkConstraintResult.rows.length, 1, "Check constraint for status should be present");
    });
  });

  describe('down migration', () => {
    it('should revert the status column to inactive', async () => {
      await down(db); // Call the down migration

      const result = await db.raw("SELECT column_default FROM information_schema.columns WHERE table_name = 'pils' AND column_name = 'status'");
      assert.equal(result.rows[0].column_default, "'inactive'::text", "Default value for status should be 'inactive' after down migration");

      const checkConstraintResult = await db.raw("SELECT conname FROM pg_constraint WHERE conname = 'pils_status_check'");
      assert.equal(checkConstraintResult.rows.length, 1, "Check constraint for status should still be present");
    });
  });
});
