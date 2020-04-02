const assert = require('assert');
const uuid = require('uuid/v4');
const isuuid = require('uuid-validate');
const { cloneDeep, omit } = require('lodash');
const diff = require('deep-diff');
const db = require('./helpers/db');
const { transform, up } = require('../../migrations/20200323140559_speciesdetails_ids');

describe('transform', () => {

  it('returns undefined if passed a falsy data blob', () => {
    assert.equal(transform(), undefined);
  });

  it('returns untouched input if input has no protocols', () => {
    const input = {
      title: 'Test title'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has empty protocols', () => {
    const input = {
      title: 'Test title',
      protocols: []
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has non-array protocols', () => {
    const input = {
      title: 'Test title',
      protocols: 'This should not be possible'
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have no species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1' },
        { title: 'Protocol 2' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if input has null protocols', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1' },
        null,
        { title: 'Protocol 2' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have non-array species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', speciesDetails: 'also not theoretically possible' }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('returns untouched input if protocols have empty species details', () => {
    const input = {
      title: 'Test title',
      protocols: [
        { title: 'Protocol 1', speciesDetails: [] }
      ]
    };
    const expected = cloneDeep(input);
    assert.deepEqual(transform(input), expected);
  });

  it('adds id properties to speciesDetails on protocols where they are missing', () => {
    const input = {
      title: 'Test title',
      protocols: [
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' } ]
        },
        {
          title: 'Protocol 2',
          speciesDetails: [ { value: 'mice' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);
    assert.deepEqual(omit(output, 'protocols'), omit(expected, 'protocols'), 'non protocol data should be untouched');
    assert.deepEqual(output.protocols[0], expected.protocols[0], 'first protocol should be untouched');

    assert.deepEqual(omit(output.protocols[1], 'speciesDetails'), omit(expected.protocols[1], 'speciesDetails'), 'non speciesDetails data on second protocol should be untouched');

    assert.equal(output.protocols[1].speciesDetails[0].value, 'mice');
    assert.ok(isuuid(output.protocols[1].speciesDetails[0].id));
  });

  it('handles some speciesDetails on a single protocol having missing ids', () => {
    const input = {
      title: 'Test title',
      protocols: [
        null,
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' }, { value: 'rats' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);

    assert.equal(output.protocols[0], null);
    assert.ok(output.protocols[1].speciesDetails.every(sd => isuuid(sd.id)), 'all speciesDetails should have id: uuid');
  });

  it('handles some speciesDetails being null', () => {
    const input = {
      title: 'Test title',
      protocols: [
        null,
        {
          title: 'Protocol 1',
          speciesDetails: [ { id: uuid(), value: 'mice' }, { value: 'rats' } ]
        },
        {
          title: 'Protocol 2',
          speciesDetails: [ { id: uuid(), value: 'mice' }, null, { value: 'rats' } ]
        }
      ]
    };
    const expected = cloneDeep(input);
    const output = transform(input);

    assert.equal(output.protocols[0], null);
    assert.ok(output.protocols[1].speciesDetails.every(sd => isuuid(sd.id)), 'all speciesDetails should have id: uuid');

    assert.ok(isuuid(output.protocols[2].speciesDetails[0].id), 'speciesDetails[0] should have id: uuid');
    assert.equal(output.protocols[2].speciesDetails[1], null, 'speciesDetails[1] should be null');
    assert.ok(isuuid(output.protocols[2].speciesDetails[2].id), 'speciesDetails[2] should have id: uuid');
  });

});

describe('up', () => {

  const ids = {
    versions: uuid(),
    draft: uuid(),
    legacy: uuid(),
    noprotocols: uuid()
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
      id: ids.versions,
      title: 'Project with granted versions',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 1
    },
    {
      id: ids.draft,
      title: 'Project draft',
      licence_holder_id: licenceHolder.id,
      status: 'inactive',
      schema_version: 1
    },
    {
      id: ids.legacy,
      title: 'Legacy Project',
      licence_holder_id: licenceHolder.id,
      status: 'active',
      schema_version: 0
    },
    {
      id: ids.noprotocols,
      title: 'No protocols',
      licence_holder_id: licenceHolder.id,
      status: 'inactive',
      schema_version: 1
    }
  ];

  const versions = [
    {
      project_id: ids.noprotocols,
      status: 'draft',
      data: {
        title: 'No protocols'
      }
    },
    {
      project_id: ids.legacy,
      status: 'granted',
      data: {
        protocols: [
          { title: 'protocol 1' }
        ]
      },
      created_at: '2019-01-01T12:00:00.000Z'
    },
    {
      project_id: ids.legacy,
      status: 'granted',
      data: {
        protocols: [
          { title: 'protocol 1 edited' }
        ]
      },
      created_at: '2019-02-01T12:00:00.000Z'
    },
    {
      project_id: ids.versions,
      status: 'granted',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      created_at: '2019-01-01T12:00:00.000Z'
    },
    {
      project_id: ids.versions,
      status: 'granted',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      created_at: '2019-02-01T12:00:00.000Z'
    },
    {
      project_id: ids.versions,
      status: 'draft',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      created_at: '2019-03-01T12:00:00.000Z'
    },
    {
      project_id: ids.draft,
      status: 'submitted',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'mice' }
            ]
          }
        ]
      },
      created_at: '2019-01-01T12:00:00.000Z'
    },
    {
      project_id: ids.draft,
      status: 'draft',
      data: {
        protocols: [
          {
            speciesDetails: [
              { value: 'rats' }
            ]
          }
        ]
      },
      created_at: '2019-02-01T12:00:00.000Z'
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

  it('is ok', () => {
    assert.ok(true);
  });

  it('does not change any properties, only adds new ids', () => {
    return Promise.resolve()
      .then(() => {
        return this.knex('projects')
          .leftJoin('project_versions', 'projects.id', 'project_versions.project_id')
          .orderBy('projects.title', 'asc')
          .orderBy('project_versions.created_at', 'asc');
      })
      .then(before => {
        return Promise.resolve()
          .then(() => {
            return up(this.knex)
          })
          .then(() => {
            return this.knex('projects')
              .select('*')
              .leftJoin('project_versions', 'projects.id', 'project_versions.project_id')
              .orderBy('projects.title', 'asc')
              .orderBy('project_versions.created_at', 'asc');
          })
          .then(after => {
            const changes = diff(before, after);
            assert.ok(changes.every(change => {
              return change.kind === 'N' && change.path.pop() === 'id';
            }));
          })
      });
  });

  it('adds missing id properties only to the latest version', () => {
    return up(this.knex)
      .then(() => {
        return this.knex('project_versions')
          .where('project_id', ids.versions)
          .orderBy('created_at', 'asc');
      })
      .then(versions => {
        versions.forEach(version => {
          if (version.status === 'granted') {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(!sd.id, 'id should not have been added to previous granted versions');
            }));
          } else {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(sd.id, 'id should have been added to latest version');
            }));
          }
        });
      });
  });

  it('adds missing id properties to drafts', () => {
    return up(this.knex)
      .then(() => {
        return this.knex('project_versions')
          .where('project_id', ids.draft)
          .orderBy('created_at', 'asc');
      })
      .then(versions => {
        versions.forEach(version => {
          if (version.status === 'submitted') {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(!sd.id, 'id should not have been added to previous granted versions');
            }));
          } else {
            version.data.protocols.every(protocol => protocol.speciesDetails.every(sd => {
              assert.ok(sd.id, 'id should have been added to latest version');
            }));
          }
        });
      });
  });

});
