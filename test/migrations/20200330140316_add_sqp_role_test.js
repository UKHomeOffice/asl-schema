import assert from 'assert';
import knex from 'knex';
import knexConfig from '../../knexfile.js';

import data from '../functional/helpers/db.js';
import { up, down } from '../../migrations/20200330140316_add_sqp_role.mjs';

const db = knex(knexConfig.test);

describe('20200330140316_add_sqp_role_test', () => {
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
    // Run latest migrations
    await db.migrate.latest();
  });

  after(async () => {
    // await db.raw('DROP TABLE IF EXISTS roles CASCADE');
    // await db.schema.dropTableIfExists('roles');
    // await db.destroy();
  });

  describe('Migration Up', () => {
    it('should allow insertion of valid enum values', async () => {
      // await up(db);
      //
      // const validRoles = ['pelh', 'nacwo', 'nvs', 'sqp', 'nio', 'ntco', 'nprc', 'holc'];
      // for (let role of validRoles) {
      //   await db('roles').insert({ type: role });
      //   const result = await db('roles').where({ type: role }).first();
      //   assert.equal(result.type, role, `The type should be set to ${role}`);
      // }
    });

    it('should reject insertion of invalid enum values', async () => {
      // await up(db);
      //
      // try {
      //   await db('roles').insert({ type: 'invalid_role' });
      // } catch (err) {
      //   assert(
      //     err.message.includes('invalid input value'),
      //     'Error should be thrown for invalid enum value'
      //   );
      // }
    });

    it('should set default value to null', async () => {
      // await up(db);
      //
      // await db('roles').insert({});
      // const result = await db('roles').whereNull('type').first();
      // assert.equal(result.type, null, "The default value for 'type' should be null");
    });
  });
});
