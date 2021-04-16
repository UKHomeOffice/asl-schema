const uuid = require('uuid/v4');
const assert = require('assert');
const db = require('../helpers/db');

const PROJECT_ID = uuid();
const TRAINEE_ID = uuid();

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
              id: '4deac5a2-6530-4f93-ba9f-d1b3db574ad9',
              firstName: 'Vincent',
              lastName: 'Malloy',
              email: 'vincent@malloy.com'
            },
            {
              id: '3e516ccd-6631-4868-8f27-70797251ecee',
              firstName: 'Sterling',
              lastName: 'Archer',
              email: 'sterling@archer.com',
              pilLicenceNumber: 'ABC-123-02',
              pil: {
                status: 'active',
                establishmentId: 8201
              }
            },
            {
              id: '7a914e0c-90ad-46da-b468-5b64c3a1b183',
              firstName: 'Keith',
              lastName: 'Lemon',
              email: 'keith@lemon.com',
              pilLicenceNumber: 'ABC-123-03',
              pil: {
                status: 'inactive',
                establishmentId: 8201
              },
              roles: [{
                establishmentId: 8201,
                type: 'nacwo'
              }]
            },
            {
              id: '3e6dcec1-004c-41fa-83b3-63ab6ec94b0c',
              firstName: 'Bruce',
              lastName: 'Forsyth',
              email: 'bruce@forsyth.com',
              pilLicenceNumber: 'ABC-123-04',
              pil: {
                status: 'active',
                establishmentId: 8201
              },
              roles: [{
                establishmentId: 8201,
                type: 'nacwo'
              }]
            },
            {
              id: '7053e9b5-a8ab-4074-8ec5-b0134d6f58ec',
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
              id: 'ee9c6778-f4a5-43f6-b674-747a6377af23',
              firstName: 'Double',
              lastName: 'Agent',
              email: 'doubleagent@example.com',
              roles: [
                { establishmentId: 8201, type: 'ntco' }
              ]
            },
            {
              '#id': 'multi.establishment',
              id: 'e7d0a987-62b5-48b5-8f27-9687b7a55cae',
              firstName: 'Multi',
              lastName: 'Establishment',
              email: 'multi.establishment@example.com'
            },
            {
              id: TRAINEE_ID,
              firstName: 'Trainee',
              lastName: 'Cat-e',
              email: 'trainee@example.com'
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
              id: '8ce59dba-b357-486c-8eab-fc8d04729aad',
              firstName: 'Austin',
              lastName: 'Powers',
              email: 'groovy@baby.com',
              pilLicenceNumber: 'ABC-123-06',
              pil: {
                status: 'active',
                establishmentId: 8202
              }
            },
            {
              id: '3aefd889-a2d0-47c4-9b39-bb5dd880889b',
              firstName: 'Clark',
              lastName: 'Kent',
              email: 'super@man.com',
              pilLicenceNumber: 'ABC-123-07',
              pil: {
                status: 'inactive',
                establishmentId: 8202
              }
            },
            {
              '#ref': 'doubleagent'
            },
            {
              '#ref': 'multi.establishment'
            }
          ]
        }
      ], { allowRefs: true }))
      .then(() => this.models.Project.query().insert({
        id: PROJECT_ID,
        establishmentId: 8201,
        title: 'Training project',
        status: 'active'
      }))
      .then(() => this.models.TrainingCourse.query().insertGraph({
        establishmentId: 8201,
        species: ['Mice'],
        title: 'Training course',
        startDate: '2025-01-01',
        projectId: PROJECT_ID,
        trainingPils: [
          {
            status: 'active',
            profileId: TRAINEE_ID
          }
        ]
      }))
      // give asru users the same names as non-ASRU users to test search filtering
      .then(() => this.models.Profile.query().insert([
        {
          id: uuid(),
          firstName: 'Double',
          lastName: 'Agent',
          email: 'asru1@example.com',
          asruUser: true
        },
        {
          id: uuid(),
          firstName: 'Bruce',
          lastName: 'Forsyth',
          email: 'asru2@example.com',
          asruUser: true
        }
      ]));
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

    it('can search ASRU users on full name', () => {
      const opts = {
        search: 'Bruce Forsyth'
      };
      return Promise.resolve()
        .then(() => this.models.Profile.searchAndFilterAsru(opts))
        .then(profiles => {
          assert.deepEqual(profiles.total, 1);
          assert.equal(profiles.results[0].email, 'asru2@example.com');
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
          assert.deepEqual(profiles.total, 3);
          assert.deepEqual(profiles.results.map(p => p.firstName).sort(), ['Bruce', 'Sterling', 'Trainee']);
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

    it('returns all related establishments if no establishmentId is passed', () => {
      const notEstablishmentScoped = this.models.Profile.scopeSingle({
        id: 'e7d0a987-62b5-48b5-8f27-9687b7a55cae'
      });

      return notEstablishmentScoped.get()
        .then(profile => {
          assert(profile.establishments.length === 2, 'it should list all related establishments');
          assert(profile.establishments.find(e => e.id === 8201), 'it should list the first establishment');
          assert(profile.establishments.find(e => e.id === 8202), 'it should list the second establishment');
        });
    });

    it('returns only the scoped establishment if establishmentId is passed', () => {
      const establishmentScoped = this.models.Profile.scopeSingle({
        id: 'e7d0a987-62b5-48b5-8f27-9687b7a55cae',
        establishmentId: 8201
      });

      return establishmentScoped.get()
        .then(profile => {
          assert(profile.establishments.length === 1, 'it should only list the scoped establishment');
          assert(profile.establishments[0].id === 8201, 'it should only list the scoped establishment');
        });
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

      this.asruAdmin = {
        id: 'a8e6f04b-f3a6-4378-91fa-f612d4ed1102',
        lastName: 'Admin',
        firstName: 'Asru',
        email: 'asruadmin@homeoffice.gov.uk',
        asruUser: true,
        asruAdmin: true
      };

      this.asruSupport = {
        id: '6891fe52-fb55-4d81-a7f5-24046d590407',
        lastName: 'Support',
        firstName: 'Asru',
        email: 'asru-support@homeoffice.gov.uk',
        asruUser: true,
        asruSupport: true
      };

      this.asruRops = {
        id: 'f0bce9a2-9832-4aa8-8a83-b7210fa6e541',
        lastName: 'Ropper',
        firstName: 'Asru',
        email: 'asru-ropper@homeoffice.gov.uk',
        asruUser: true,
        asruRops: true
      };

      return this.models.Profile.query().insertGraph([
        this.inspector, this.licensing, this.asruAdmin, this.asruSupport, this.asruRops
      ]);
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

    it('strips admin role when removing ASRU role', () => {
      return this.models.Profile.query().patchAndFetchById(this.asruAdmin.id, { asruUser: false })
        .then(profile => {
          assert(profile.asruAdmin === false, 'the profile should have asru admin role removed');
        });
    });

    it('strips support role when removing ASRU role', () => {
      return this.models.Profile.query().patchAndFetchById(this.asruSupport.id, { asruUser: false })
        .then(profile => {
          assert(profile.asruSupport === false, 'the profile should have asru support role removed');
        });
    });

    it('strips rops role when removing ASRU role', () => {
      return this.models.Profile.query().patchAndFetchById(this.asruRops.id, { asruUser: false })
        .then(profile => {
          assert(profile.asruRops === false, 'the profile should have asru rop role removed');
        });
    });
  });
});
