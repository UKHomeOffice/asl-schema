const uuid = require('uuid/v4');
const assert = require('assert');
const db = require('./helpers/db');
const { transform, up } = require('../../migrations/20200803123703_flatten_certificate_modules');

describe('transform', () => {
  it('returns undefined if called without modules', () => {
    assert.equal(transform({ species: ['Cats'] }), undefined);
  });

  it('returns undefined if module is empty array', () => {
    assert.equal(transform({ species: ['Cats'], modules: [] }), undefined);
  });

  it('flattens modules to a list of module strings, hoisting species to top level', () => {
    const input = {
      modules: [
        {
          module: 'PILA (theory)',
          species: ['Cats']
        }
      ]
    };
    const expected = {
      modules: JSON.stringify(['PILA (theory)']),
      species: JSON.stringify(['Cats'])
    };
    assert.deepEqual(transform(input), expected);
  });

  it('combines species from all modules, and species if existing, ignoring dupes', () => {
    const input = {
      modules: [
        {
          module: 'PILA (theory)',
          species: ['Mice', 'Rats']
        },
        {
          module: 'PILA (skills)',
          species: ['Cats']
        }
      ],
      species: ['Mice', 'Cows']
    };

    const expected = {
      modules: JSON.stringify(['PILA (theory)', 'PILA (skills)']),
      species: JSON.stringify(['Mice', 'Cows', 'Rats', 'Cats'])
    };
    assert.deepEqual(transform(input), expected);
  });
});

describe('up', () => {
  const ids = {
    holc: uuid(),
    cert: {
      noSpecies: uuid(),
      repeatedSpecies: uuid(),
      noModules: uuid(),
      combinedFormat: uuid()
    }
  };

  const profiles = [
    {
      id: ids.holc,
      first_name: 'Bruce',
      last_name: 'Banner',
      email: 'holc@example.com'
    }
  ];

  const certificates = [
    {
      id: ids.cert.noModules,
      profile_id: ids.holc
    },
    {
      id: ids.cert.noSpecies,
      profile_id: ids.holc,
      modules: JSON.stringify([
        {
          module: 'PILA (theory)',
          species: ['Mice', 'Rats']
        },
        {
          module: 'PILA (skills)',
          species: ['Dogs']
        }
      ])
    },
    {
      id: ids.cert.repeatedSpecies,
      profile_id: ids.holc,
      modules: JSON.stringify([
        {
          module: 'PILA (theory)',
          species: ['Mice', 'Cats']
        },
        {
          module: 'PILA (skills)',
          species: ['Dogs']
        },
        {
          module: 'K',
          species: ['Horses']
        }
      ]),
      species: JSON.stringify(['Mice', 'Rats'])
    },
    {
      id: ids.cert.combinedFormat,
      profile_id: ids.holc,
      modules: JSON.stringify([
        {
          module: 'PILA (theory)',
          species: ['Cats']
        },
        'PILA (skills)',
        {
          module: 'K',
          species: ['BABU']
        }
      ]),
      species: JSON.stringify(['JABU'])
    }
  ];

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('profiles').insert(profiles))
      .then(() => this.knex('certificates').insert(certificates));
  });

  afterEach(() => {
    return db.clean(this.knex);
  });

  after(() => {
    return this.knex.destroy();
  });

  it('doesnt make any changes in no modules detected', () => {
    return Promise.resolve()
      .then(() => this.knex('certificates').where('id', ids.cert.noModules).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('certificates').where('id', ids.cert.noModules).first())
          .then(after => {
            assert.deepEqual(before, after);
          });
      });
  });

  it('adds species to top level from modules, and flattens modules', () => {
    return Promise.resolve()
      .then(() => this.knex('certificates').where('id', ids.cert.noSpecies).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('certificates').where('id', ids.cert.noSpecies).first())
          .then(after => {
            const expected = {
              modules: ['PILA (theory)', 'PILA (skills)'],
              species: ['Mice', 'Rats', 'Dogs']
            };
            assert.deepEqual(after, { ...before, ...expected });
          });
      });
  });

  it('adds species to top level from modules, and flattens modules', () => {
    return Promise.resolve()
      .then(() => this.knex('certificates').where('id', ids.cert.repeatedSpecies).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('certificates').where('id', ids.cert.repeatedSpecies).first())
          .then(after => {
            const expected = {
              modules: ['PILA (theory)', 'PILA (skills)', 'K'],
              species: ['Mice', 'Rats', 'Cats', 'Dogs', 'Horses']
            };
            assert.deepEqual(after, { ...before, ...expected });
          });
      });
  });

  it('handles combined module format', () => {
    return Promise.resolve()
      .then(() => this.knex('certificates').where('id', ids.cert.combinedFormat).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('certificates').where('id', ids.cert.combinedFormat).first())
          .then(after => {
            const expected = {
              modules: ['PILA (theory)', 'PILA (skills)', 'K'],
              species: ['JABU', 'Cats', 'BABU']
            };
            assert.deepEqual(after, { ...before, ...expected });
          });
      });
  });
});
