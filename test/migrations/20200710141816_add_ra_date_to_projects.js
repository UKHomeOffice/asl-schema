import { v4 as uuid } from 'uuid';
import assert from 'assert';
import moment from 'moment';
import {getRaDate, up} from '../../migrations/20200710141816_add_ra_date_to_projects.js';
import Knex from 'knex';
import dbExtra from '../functional/helpers/db.js';

describe('getRaDate', () => {
  it('returns null if no version', () => {
    assert.equal(getRaDate(undefined, {}), null);
  });

  it('returns null if no version.data', () => {
    assert.equal(getRaDate({ foo: 'bar' }, {}), null);
  });

  it('returns null if no project', () => {
    assert.equal(getRaDate({ foo: 'bar' }), null);
  });

  it('returns null if ra_compulsory is falsy', () => {
    assert.equal(getRaDate({ ra_compulsory: false }, {}), null);
  });

  it('returns null if ra_compulsory is falsy', () => {
    assert.equal(getRaDate({ ra_compulsory: false }, {}), null);
  });

  it('returns a date 6 months after expiry if ra_compulsory is true and project is active', () => {
    const version = {
      ra_compulsory: true,
      data: {}
    };
    const project = {
      status: 'active',
      expiry_date: moment().add(1, 'year').toISOString()
    };
    const expected = moment(project.expiry_date).add(6, 'months').toISOString();

    assert.equal(getRaDate(version, project), expected);
  });

  it('returns a date 6 months after revocation_date if ra_compulsory is true and project is revoked', () => {
    const version = {
      ra_compulsory: true,
      data: {}
    };
    const project = {
      status: 'revoked',
      expiry_date: moment().add(1, 'year').toISOString(),
      revocation_date: moment().subtract(2, 'months').toISOString()
    };
    const expected = moment(project.revocation_date).add(6, 'months').toISOString();

    assert.equal(getRaDate(version, project), expected);
  });

  it('returns ra_date if version.data.retrospectiveAssessment is true', () => {
    const version = {
      ra_compulsory: false,
      data: {
        retrospectiveAssessment: true
      }
    };
    const project = {
      status: 'active',
      expiry_date: moment().add(1, 'year').toISOString()
    };
    const expected = moment(project.expiry_date).add(6, 'months').toISOString();

    assert.equal(getRaDate(version, project), expected);
  });

  it('returns ra_date if retrospectiveAssessment.retrospective-assessment-required is true (legacy)', () => {
    const version = {
      ra_compulsory: false,
      data: {
        retrospectiveAssessment: {
          'retrospective-assessment-required': true
        }
      }
    };
    const project = {
      status: 'active',
      expiry_date: moment().add(1, 'year').toISOString()
    };
    const expected = moment(project.expiry_date).add(6, 'months').toISOString();

    assert.equal(getRaDate(version, project), expected);
  });

  it('returns ra_date if conditions contain retrospective-assessment', () => {
    const version = {
      ra_compulsory: false,
      data: {
        conditions: [
          {
            key: 'retrospective-assessment'
          }
        ]
      }
    };
    const project = {
      status: 'active',
      expiry_date: moment().add(1, 'year').toISOString()
    };
    const expected = moment(project.expiry_date).add(6, 'months').toISOString();

    assert.equal(getRaDate(version, project), expected);
  });
});

describe('up', () => {
  const { knexInstance: dbInstance } = dbExtra;
  const client = dbInstance.client.config.client;
  const connection = dbInstance.client.config.connection;

  const knexInstance = Knex({
    client: client,
    connection: connection
  });

  const ids = {
    draftProject: uuid(),
    revokedProject: uuid(),
    expiredProject: uuid(),
    legacyRa: uuid(),
    activeRA: uuid(),
    activeNoRA: uuid(),
    multipleVersionsLatestNoRa: uuid(),
    multipleVersionsLatestRa: uuid()
  };

  const licenceHolder = {
    id: uuid(),
    first_name: 'Licence',
    last_name: 'Holder',
    email: 'test@example.com'
  };

  const establishment = {
    id: 100,
    name: 'An establishment',
    email: 'an@establishment.com',
    country: 'england',
    address: '123 Somwhere street'
  };

  const projects = [
    {
      id: ids.draftProject,
      title: 'Draft project',
      licence_holder_id: licenceHolder.id,
      status: 'inactive',
      schema_version: 1
    },
    {
      id: ids.revokedProject,
      title: 'Revoked project',
      licence_holder_id: licenceHolder.id,
      status: 'revoked',
      schema_version: 1,
      expiry_date: moment().add(3, 'months').toISOString(),
      revocation_date: moment().subtract(2, 'months').toISOString()
    },
    {
      id: ids.expiredProject,
      title: 'Expired project',
      licence_holder_id: licenceHolder.id,
      status: 'expired',
      schema_version: 1,
      expiry_date: moment().subtract(3, 'months').toISOString()
    },
    {
      id: ids.legacyRa,
      title: 'Legacy RA project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0,
      expiry_date: moment().add(1, 'year').toISOString()
    },
    {
      id: ids.activeRA,
      title: 'Active RA project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1,
      expiry_date: moment().add(1, 'year').toISOString()
    },
    {
      id: ids.activeNoRA,
      title: 'Active non RA project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1,
      expiry_date: moment().add(1, 'year').toISOString()
    },
    {
      id: ids.multipleVersionsLatestNoRa,
      title: 'Multiple versions latest no RA',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1,
      expiry_date: moment().add(1, 'year').toISOString()
    },
    {
      id: ids.multipleVersionsLatestRa,
      title: 'Multiple versions latest RA',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1,
      expiry_date: moment().add(1, 'year').toISOString()
    }
  ];

  const versions = [
    {
      project_id: ids.draftProject,
      status: 'draft',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      }
    },
    {
      project_id: ids.revokedProject,
      status: 'granted',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      }
    },
    {
      project_id: ids.expiredProject,
      status: 'granted',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      }
    },
    {
      project_id: ids.legacyRa,
      status: 'granted',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      }
    },
    {
      project_id: ids.activeRA,
      status: 'granted',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      }
    },
    {
      project_id: ids.activeNoRA,
      status: 'granted',
      ra_compulsory: false,
      data: {
        species: [
          'mice'
        ]
      }
    },
    {
      project_id: ids.multipleVersionsLatestNoRa,
      status: 'granted',
      ra_compulsory: false,
      data: {
        species: [
          'mice'
        ]
      },
      created_at: moment().subtract(3, 'months').toISOString()
    },
    {
      project_id: ids.multipleVersionsLatestNoRa,
      status: 'granted',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      },
      created_at: moment().subtract(4, 'months').toISOString()
    },
    {
      project_id: ids.multipleVersionsLatestRa,
      status: 'granted',
      ra_compulsory: true,
      data: {
        species: [
          'marmosets'
        ]
      },
      created_at: moment().subtract(3, 'months').toISOString()
    },
    {
      project_id: ids.multipleVersionsLatestRa,
      status: 'granted',
      ra_compulsory: false,
      data: {
        species: [
          'mice'
        ]
      },
      created_at: moment().subtract(4, 'months').toISOString()
    }
  ];

  let model = null;

  before(async () => {
    model = await dbExtra.init();
  });

  beforeEach(async () => {
    await dbExtra.clean(model);
    try {
      await knexInstance('establishments').insert(establishment);
      await knexInstance('profiles').insert(licenceHolder);
      await knexInstance('projects').insert(projects);
      await knexInstance('project_versions').insert(versions);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  });

  after(async () => {
    // Destroy the database connection after cleanup.
    await dbExtra.clean(model);
    await knexInstance.destroy();
  });

  it('does not set RA date for draft project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.draftProject).first())
      .then(project => {
        assert.equal(project.ra_date, null);
      });
  });

  it('sets ra date from revocation date for revoked project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.revokedProject).first())
      .then(project => {
        const expected = moment(project.revocation_date).add(6, 'months');
        assert.ok(moment(project.ra_date).isSame(expected));
      });
  });

  it('sets ra date from expiry date for expired project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.expiredProject).first())
      .then(project => {
        const expected = moment(project.expiry_date).add(6, 'months');
        assert.ok(moment(project.ra_date).isSame(expected));
      });
  });

  it('sets ra date for legacy RA project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.legacyRa).first())
      .then(project => {
        const expected = moment(project.expiry_date).add(6, 'months');
        assert.ok(moment(project.ra_date).isSame(expected));
      });
  });

  it('sets ra date for active project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.activeRA).first())
      .then(project => {
        const expected = moment(project.expiry_date).add(6, 'months');
        assert.ok(moment(project.ra_date).isSame(expected));
      });
  });

  it('does not set RA for non RA active project', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.activeNoRA).first())
      .then(project => {
        assert.equal(project.ra_date, null);
      });
  });

  it('does not set RA if latest granted version does not require ra', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.multipleVersionsLatestNoRa).first())
      .then(project => {
        assert.equal(project.ra_date, null);
      });
  });

  it('sets RA if latest granted version requires ra', () => {
    return Promise.resolve()
      .then(() => up(knexInstance))
      .then(() => knexInstance('projects').where('id', ids.multipleVersionsLatestRa).first())
      .then(project => {
        const expected = moment(project.expiry_date).add(6, 'months');
        assert.ok(moment(project.ra_date).isSame(expected));
      });
  });
});
