const uuid = require('uuid/v4');
const moment = require('moment');
const { isMatch } = require('lodash');
const assert = require('assert');
const db = require('./helpers/db');
const { transform, up } = require('../../migrations/20200803150819_migrate_exemptions_to_certs');

describe('transform', () => {
  it('returns an empty object if called with an empty array', () => {
    assert.deepEqual(transform([]), {});
  });

  it('combines exemption reasons, separating with new lines', () => {
    const input = [
      {
        description: 'First reason'
      },
      {
        description: 'Second reason'
      }
    ];
    const expected = 'First reason\nSecond reason';
    assert.deepEqual(transform(input).exemption_reason, expected);
  });

  it('combines modules', () => {
    const input = [
      {
        module: 'PILA (theory)'
      },
      {
        module: 'PILA (skills)'
      }
    ];
    const expected = ['PILA (theory)', 'PILA (skills)'];
    assert.deepEqual(transform(input).modules, expected);
  });

  it('combines species', () => {
    const input = [
      {
        species: ['Mice', 'Rats']
      },
      {
        species: ['JABU', 'BABU']
      }
    ];
    const expected = ['Mice', 'Rats', 'JABU', 'BABU'];
    assert.deepEqual(transform(input).species, expected);
  });

  it('combines multiple exemption models into a single certificate', () => {
    const profile_id = uuid();
    const created_at = moment().subtract(3, 'months').toISOString();
    const updated_at = moment().subtract(1, 'months').toISOString();
    const input = [
      {
        module: 'PILA (skills)',
        species: ['Mice', 'Rats'],
        description: 'First description',
        profile_id,
        created_at,
        updated_at
      },
      {
        module: 'PILA (theory)',
        species: ['JABU', 'BABU'],
        description: 'Second description',
        profile_id,
        created_at,
        updated_at
      }
    ];
    const expected = {
      modules: ['PILA (skills)', 'PILA (theory)'],
      species: ['Mice', 'Rats', 'JABU', 'BABU'],
      exemption_reason: 'First description\nSecond description',
      profile_id,
      created_at,
      updated_at
    };
    assert.deepEqual(transform(input), expected);
  });
});

describe('up', () => {

  const ids = {
    profile: {
      holc: uuid(),
      archer: uuid()
    }
  };

  const profiles = [
    {
      id: ids.profile.holc,
      first_name: 'Bruce',
      last_name: 'Banner',
      email: 'holc@example.com'
    },
    {
      id: ids.profile.archer,
      first_name: 'Sterling',
      last_name: 'Archer',
      email: 'archer@example.com'
    }
  ];

  const exemptions = [
    {
      profile_id: ids.profile.holc,
      module: 'PILA (theory)',
      species: JSON.stringify(['JABU', 'BABU']),
      description: 'First description',
      created_at: moment().subtract(4, 'months').toISOString(),
      updated_at: moment().subtract(4, 'months').toISOString()
    },
    {
      profile_id: ids.profile.holc,
      module: 'PILA (skills)',
      species: JSON.stringify(['Nemo', 'Dory']),
      description: 'Second description',
      created_at: moment().subtract(3, 'months').toISOString(),
      updated_at: moment().subtract(3, 'months').toISOString()
    },
    {
      profile_id: ids.profile.archer,
      module: 'K',
      species: JSON.stringify(['Mice']),
      description: 'First description',
      created_at: moment().subtract(3, 'months').toISOString(),
      updated_at: moment().subtract(3, 'months').toISOString()
    },
    {
      profile_id: ids.profile.archer,
      module: 'PPL',
      species: JSON.stringify(['Rats', 'Cats']),
      description: 'Second description',
      created_at: moment().subtract(2, 'months').toISOString(),
      updated_at: moment().subtract(2, 'months').toISOString()
    }
  ];

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('profiles').insert(profiles))
      .then(() => this.knex('exemptions').insert(exemptions));
  });

  afterEach(() => {
    return db.clean(this.knex);
  });

  after(() => {
    return this.knex.destroy();
  });

  it('combines exemptions for holc', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('certificates').where('profile_id', ids.profile.holc).first())
      .then(certificate => {
        const expected = {
          profile_id: ids.profile.holc,
          modules: ['PILA (theory)', 'PILA (skills)'],
          species: ['JABU', 'BABU', 'Nemo', 'Dory'],
          exemption_reason: 'First description\nSecond description',
          is_exemption: true
        };
        assert.ok(isMatch(certificate, expected));
      });
  });

  it('combines exemptions for other profile', () => {
    return Promise.resolve()
      .then(() => up(this.knex))
      .then(() => this.knex('certificates').where('profile_id', ids.profile.archer).first())
      .then(certificate => {
        const expected = {
          profile_id: ids.profile.archer,
          modules: ['K', 'PPL'],
          species: ['Mice', 'Rats', 'Cats'],
          exemption_reason: 'First description\nSecond description',
          is_exemption: true
        };
        assert.ok(isMatch(certificate, expected));
      });
  });
});
