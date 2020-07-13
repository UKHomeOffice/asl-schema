const uuid = require('uuid/v4');
const assert = require('assert');
const db = require('./helpers/db');
const { raCompulsory, up } = require('../../migrations/20200710105739_migrate_version_raCompulsory');

describe('raCompulsory', () => {
  it('is false if no version', () => {
    assert.equal(raCompulsory(), false);
  });

  it('is false if no version.data', () => {
    assert.equal(raCompulsory({ foo: 'bar' }), false);
  });

  it('is false if no version.data', () => {
    assert.equal(raCompulsory({ foo: 'bar' }), false);
  });

  it('is true if species contains disallowed species', () => {
    const version = {
      data: {
        species: ['cats']
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is true if species-other disallowed species', () => {
    const version = {
      data: {
        'species-other': ['Cats']
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is false if species contains allowed species', () => {
    const version = {
      data: {
        species: ['mice']
      }
    };
    assert.equal(raCompulsory(version), false);
  });

  it('is true if project uses endangered animals', () => {
    const version = {
      data: {
        'endangered-animals': true
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is true if some protocols are severe', () => {
    const version = {
      data: {
        protocols: [
          {
            severity: 'mild'
          },
          {
            severity: 'severe'
          }
        ]
      }
    };
    assert.equal(raCompulsory(version), true);
  });

  it('is false if no protocols are severe', () => {
    const version = {
      data: {
        protocols: [
          {
            severity: 'mild'
          },
          {
            severity: 'moderate'
          }
        ]
      }
    };
    assert.equal(raCompulsory(version), false);
  });
});

describe('up', () => {
  const ids = {
    project: {
      active: uuid(),
      legacy: uuid()
    },
    version: {
      activeRA: uuid(),
      activeNoRA: uuid(),
      legacyDraftNoRa: uuid(),
      legacyGrantedRA: uuid()
    }
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
      id: ids.project.active,
      title: 'Test project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.project.legacy,
      title: 'Legacy Project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0
    }
  ];

  const versions = [
    {
      id: ids.version.legacyDraftNoRa,
      project_id: ids.project.legacy,
      status: 'draft',
      data: {
        title: 'Legacy no RA'
      }
    },
    {
      id: ids.version.legacyGrantedRA,
      project_id: ids.project.legacy,
      status: 'granted',
      data: {
        title: 'Legacy RA',
        species: [
          'prosimians'
        ]
      }
    },
    {
      id: ids.version.activeRA,
      project_id: ids.project.active,
      status: 'granted',
      data: {
        title: 'Granted RA',
        protocols: [
          {
            title: 'protocol 1',
            severity: 'severe'
          }
        ]
      },
    },
    {
      id: ids.version.activeNoRA,
      project_id: ids.project.active,
      status: 'granted',
      data: {
        title: 'Granted no RA',
        species: 'mice',
        protocols: [
          {
            title: 'Protocol 1',
            severity: 'mild'
          }
        ]
      }
    }
  ];

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('establishments').insert(establishment))
      .then(() => this.knex('profiles').insert(licenceHolder))
      .then(() => this.knex('projects').insert(projects))
      .then(() => this.knex('project_versions').insert(versions));
  });

  afterEach(() => {
    return db.clean(this.knex);
  });

  after(() => {
    return this.knex.destroy();
  });

  it('sets ra_compulsory to true for versions where RA is required', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('project_versions').where('ra_compulsory', true))
      .then(versions => {
        const expected = [
          ids.version.legacyGrantedRA,
          ids.version.activeRA
        ];
        assert.equal(versions.length, expected.length);
        expected.forEach(id => {
          assert.ok(versions.find(version => version.id === id));
        });
      });
  });

  it('sets ra_compulsory to true for versions where RA is required', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('project_versions').where('ra_compulsory', false))
      .then(versions => {
        const expected = [
          ids.version.legacyDraftNoRa,
          ids.version.activeNoRA
        ];
        assert.equal(versions.length, expected.length);
        expected.forEach(id => {
          assert.ok(versions.find(version => version.id === id));
        });
      });
  });
});
