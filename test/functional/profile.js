const assert = require('assert');
const db = require('./helpers/db');

describe('Profile model', () => {

  before(() => {
    this.models = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.models))
      .then(() => this.models.Establishment.query().insertGraph([
        {
          id: 8201,
          name: 'An establishment',
          email: 'an@establishment.com',
          country: 'england',
          address: '123 Somewhere street',
          profiles: [
            {
              firstName: 'Vincent',
              lastName: 'Malloy',
              email: 'vincent@malloy.com'
            },
            {
              firstName: 'Sterling',
              lastName: 'Archer',
              email: 'sterling@archer.com',
              pil: {
                status: 'active',
                establishmentId: 8201,
                licenceNumber: 'ABC-123-02'
              }
            },
            {
              firstName: 'Keith',
              lastName: 'Lemon',
              email: 'keith@lemon.com',
              pil: {
                status: 'inactive',
                establishmentId: 8201,
                licenceNumber: 'ABC-123-03'
              },
              roles: [{
                establishmentId: 8201,
                type: 'nacwo'
              }]
            },
            {
              firstName: 'Bruce',
              lastName: 'Forsyth',
              email: 'bruce@forsyth.com',
              pil: {
                status: 'active',
                establishmentId: 8201,
                licenceNumber: 'ABC-123-04'
              },
              roles: [{
                establishmentId: 8201,
                type: 'nacwo'
              }]
            },
            {
              firstName: 'Stuart',
              lastName: 'Little',
              email: 'stuart@little.com',
              projects: [{
                status: 'active',
                establishmentId: 8201,
                title: 'Anti cancer research'
              }]
            },
            {
              '#id': 'doubleagent',
              firstName: 'Double',
              lastName: 'Agent',
              email: 'doubleagent@example.com',
              roles: [
                { establishmentId: 8201, type: 'ntco' }
              ]
            }
          ]
        },
        {
          id: 8202,
          name: 'Another establishment',
          email: 'another@establishment.com',
          address: '123 Another street',
          country: 'wales',
          profiles: [
            {
              firstName: 'Austin',
              lastName: 'Powers',
              email: 'groovy@baby.com',
              pil: {
                status: 'active',
                establishmentId: 8202,
                licenceNumber: 'ABC-123-06'
              }
            },
            {
              firstName: 'Clark',
              lastName: 'Kent',
              email: 'super@man.com',
              pil: {
                status: 'inactive',
                establishmentId: 8202,
                licenceNumber: 'ABC-123-07'
              }
            },
            {
              '#ref': 'doubleagent'
            }
          ]
        }
      ], { allowRefs: true }));
  });

  afterEach(() => {
    return db.clean(this.models);
  });

  after(() => {
    return this.models.destroy();
  });

  describe('search', () => {
    it('can search on full name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'vinc mal'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Vincent');
          assert.deepEqual(profiles.results[0].lastName, 'Malloy');
        });
    });

    it('can search on full name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'ster'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Sterling');
          assert.deepEqual(profiles.results[0].lastName, 'Archer');
        });
    });

    it('can search on full name', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Powers1'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 0);
        });
    });

    it('can search on licenceNumber', () => {
      const opts = {
        establishmentId: 8201,
        search: '03'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Keith');
          assert.deepEqual(profiles.results[0].lastName, 'Lemon');
        });
    });
  });

  describe('filter', () => {
    it('can filter nacwo roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          roles: ['nacwo']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 2);
          assert.deepEqual(profiles.results.map(p => p.firstName).sort(), ['Bruce', 'Keith']);
        });
    });

    it('can filter pilh pseudo roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          roles: ['pilh']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 2);
          assert.deepEqual(profiles.results.map(p => p.firstName).sort(), ['Bruce', 'Sterling']);
        });
    });

    it('can filter pelh pseudo roles', () => {
      const opts = {
        establishmentId: 8201,
        filters: {
          roles: ['pplh']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Stuart');
        });
    });
  });

  describe('searching and filtering', () => {
    it('can search and filter', () => {
      const opts = {
        establishmentId: 8201,
        search: 'Bruce',
        filters: {
          roles: ['pilh']
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Bruce');
        });
    });

    it('accepts pagination params', () => {
      const opts = {
        establishmentId: 8201,
        search: 'ABC',
        filters: {
          roles: ['pilh']
        },
        limit: 1,
        offset: 1
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 2);
          assert.deepEqual(profiles.results.length, 1);
          assert.deepEqual(profiles.results[0].firstName, 'Bruce');
        });
    });

    it('accepts sort params', () => {
      const opts = {
        establishmentId: 8201,
        search: 'ABC',
        filters: {
          roles: ['pilh']
        },
        sort: {
          column: 'firstName',
          ascending: 'false'
        }
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilter(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 2);
          assert.deepEqual(profiles.results.length, 2);
          assert.deepEqual(profiles.results[0].firstName, 'Sterling');
          assert.deepEqual(profiles.results[1].firstName, 'Bruce');
        });
    });
  });

  describe('scoped methods', () => {
    it('exports a scopeToParams method which exposes scoped getAll and getNamed methods', () => {
      const profiles = this.models.Profile.scopeToParams({});
      assert.ok(profiles.getNamed);
      assert.ok(profiles.getAll);
    });

    it('exports a scopeSingle method which exposes scoped get and getNamed methods', () => {
      const profile = this.models.Profile.scopeSingle({});
      assert.ok(profile.getNamed);
      assert.ok(profile.get);
    });

    describe('getNamedProfiles', () => {
      it('only returns named people and own profile', () => {
        const expected = [
          'vincent@malloy.com',
          'keith@lemon.com',
          'bruce@forsyth.com',
          'doubleagent@example.com'
        ];
        const notExpected = [
          'sterling@archer.com',
          'stuart@litte.com'
        ];
        return Promise.resolve()
          .then(() => this.models.Profile.query().where({ email: expected[0] }))
          .then(profiles => profiles[0])
          .then(profile => this.models.Profile.getNamedProfiles({
            userId: profile.id,
            establishmentId: 8201
          }))
          .then(({ profiles }) => {
            assert.deepEqual(profiles.results.length, 4);
            expected.forEach(email => {
              assert.ok(profiles.results.find(p => p.email === email));
            });
            notExpected.forEach(email => {
              assert.deepEqual(profiles.results.find(p => p.email === email), null);
            });
          });
      });

      describe('multi-establishment users', () => {

        it('excludes named people at other establishments', () => {
          return Promise.resolve()
            .then(() => this.models.Profile.query().where({ email: 'super@man.com' }))
            .then(profiles => profiles[0])
            .then(profile => this.models.Profile.getNamedProfiles({
              userId: profile.id,
              establishmentId: 8202
            }))
            .then(({ profiles }) => {
              const results = profiles.results.map(p => p.email);
              assert.ok(!results.includes('doubleagent@example.com'), 'User with named role at another establishment should not appear in results');
            });
        });

        it('includes named people at the same establishment', () => {
          return Promise.resolve()
            .then(() => this.models.Profile.query().where({ email: 'vincent@malloy.com' }))
            .then(profiles => profiles[0])
            .then(profile => this.models.Profile.getNamedProfiles({
              userId: profile.id,
              establishmentId: 8201
            }))
            .then(({ profiles }) => {
              const results = profiles.results.map(p => p.email);
              assert.ok(results.includes('doubleagent@example.com'), 'User with named role at scoped establishment should appear in results');
            });
        });

      });

    });

    describe('getNamed', () => {
      it('can retrieve own profile', () => {
        const email = 'vincent@malloy.com';
        return Promise.resolve()
          .then(() => this.models.Profile.query().where({ email: 'vincent@malloy.com' }))
          .then(profiles => profiles[0])
          .then(profile => this.models.Profile.getNamed({
            id: profile.id,
            userId: profile.id,
            establishmentId: 8201
          }))
          .then(profile => {
            assert.ok(profile);
            assert.deepEqual(profile.email, email);
          });
      });

      it('can retrieve the profile of a named person', () => {
        const email = 'vincent@malloy.com';
        const namedPersonEmail = 'keith@lemon.com';

        return Promise.all([
          this.models.Profile.query().where({ email }),
          this.models.Profile.query().where({ email: namedPersonEmail })
        ])
          .then(([userProfile, namedPersonProfile]) => {
            return this.models.Profile.getNamed({
              id: namedPersonProfile[0].id,
              userId: userProfile[0].id,
              establishmentId: 8201
            });
          })
          .then(profile => {
            assert.deepEqual(profile.email, namedPersonEmail);
          });
      });

      it('cannot retrieve the profile of non named person', () => {
        const email = 'vincent@malloy.com';
        const requestedProfileEmail = 'sterling@archer.com';

        return Promise.all([
          this.models.Profile.query().where({ email }),
          this.models.Profile.query().where({ email: requestedProfileEmail })
        ])
          .then(([userProfile, requestedProfile]) => {
            return this.models.Profile.getNamed({
              id: requestedProfile[0].id,
              userId: userProfile[0].id,
              establishmentId: 8201
            });
          })
          .then(profile => {
            assert.deepEqual(profile, null);
          });
      });
    });
  });

  describe('ASRU roles', () => {

    beforeEach(() => {
      this.inspector = {
        id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d1',
        firstName: 'Inspector',
        lastName: 'Morse',
        email: 'inspector-morse@example.com',
        asruUser: true,
        asruInspector: true
      };

      this.licensing = {
        id: 'a942ffc7-e7ca-4d76-a001-0b5048a057d2',
        firstName: 'Li Sen',
        lastName: 'Xing',
        email: 'lisenxing@example.com',
        asruUser: true,
        asruLicensing: true
      };

      return this.models.Profile.query().insertGraph([this.inspector, this.licensing]);
    });

    it('strips inspector role when removing ASRU role', () => {
      return this.models.Profile.query().patchAndFetchById(this.inspector.id, { asruUser: false })
        .then(profile => {
          assert(profile.asruInspector === false, 'the profile should have inspector role removed');
        });
    });

    it('strips licensing officer role when removing ASRU role', () => {
      return this.models.Profile.query().patchAndFetchById(this.licensing.id, { asruUser: false })
        .then(profile => {
          assert(profile.asruLicensing === false, 'the profile should have licensing officer role removed');
        });
    });
  });
});
