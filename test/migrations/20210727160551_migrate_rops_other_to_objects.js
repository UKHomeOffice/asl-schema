const assert = require('assert');
const { isEmpty, omit } = require('lodash');
const { v4: uuid } = require('uuid');
const isUuid = require('uuid-validate');
const db = require('./helpers/db');
const { up, transformRop, transformProc } = require('../../migrations/20210727160551_migrate_rops_other_to_objects');

describe('transformRop', () => {
  it('returns an empty object if no updates', () => {
    const rop = {};
    const output = transformRop(rop);
    assert.ok(isEmpty(output));
  });

  it('ignores non-other fields', () => {
    const rop = {
      extra: 'field'
    };
    const output = transformRop(rop);
    assert.ok(isEmpty(output));
  });

  it('ignores fields that are not strings', () => {
    const rop = {
      basic_subpurposes_other: ['Some', 'values'],
      translational_subpurposes_other: [{ id: uuid(), value: 'Value' }]
    };
    const output = transformRop(rop);
    assert.ok(isEmpty(output));
  });

  it('creates an array of one object with id for each `other` field', () => {
    const rop = {
      basic_subpurposes_other: 'Basic subpurposes other',
      regulatory_subpurposes_other: 'Regulatory subpurposes other',
      regulatory_subpurposes_other_efficacy: 'Regulatory subpurposes other efficacy',
      regulatory_subpurposes_other_toxicity: 'Regulatory subpurposes other toxicity',
      regulatory_subpurposes_other_toxicity_ecotoxicity: 'Regulatory subpurposes other toxicity ecotoxicity',
      regulatory_legislation_other: 'Regulatory legislation other',
      translational_subpurposes_other: 'Translational subpurposes other'
    };
    const output = transformRop(rop);
    assert.ok(!isEmpty(output));

    Object.keys(rop).forEach(key => {
      const item = output[key];
      assert.ok(item);
      assert.ok(Array.isArray(item));
      assert.equal(item.length, 1);
      assert.ok(isUuid(item[0].id));
      assert.equal(item[0].value, rop[key]);
    });
  });

});

describe('transformProc', () => {
  it('returns null if called without proc', () => {
    assert.equal(transformProc(), null);
  });

  it('returns null if called without ropUpdates', () => {
    assert.equal(transformProc({}), null);
  });

  it('returns null if procedure has no purposes', () => {
    assert.equal(transformProc({}, {}), null);
  });

  describe('basic', () => {
    it('returns null if no subpurposes', () => {
      const proc = {
        purposes: 'basic'
      };
      assert.equal(transformProc(proc, {}), null);
    });

    it('returns null if subpurpose is not `other`', () => {
      const proc = {
        purposes: 'basic',
        basic_subpurposes: 'oncology'
      };
      assert.equal(transformProc(proc, {}), null);
    });

    it('returns the id of the basic subpurpose', () => {
      const proc = {
        purposes: 'basic',
        basic_subpurposes: 'other'
      };
      const id = uuid();
      const ropUpdates = {
        basic_subpurposes_other: [
          {
            id,
            value: 'Some value'
          }
        ]
      };
      const expected = { subpurpose_other: id };
      assert.deepEqual(transformProc(proc, ropUpdates), expected);
    });
  });

  describe('regulatory', () => {
    it('returns null if no subpurposes or legislation', () => {
      const proc = {
        purposes: 'regulatory'
      };
      assert.equal(transformProc(proc, {}), null);
    });

    it('returns an empty object if no others', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_subpurposes: 'routine-blood'
      };

      assert.deepEqual(transformProc(proc, {}), {});
    });

    it('returns an empty object if no others', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_subpurposes: 'routine-blood'
      };

      assert.deepEqual(transformProc(proc, {}), {});
    });

    it('returns an empty object if no others', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_legislation: 'human-use'
      };

      assert.deepEqual(transformProc(proc, {}), {});
    });

    it('adds relevant id to return if other subpurpose', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_subpurposes: 'routine-other'
      };

      const id = uuid();

      const ropUpdates = {
        regulatory_subpurposes_other: [
          {
            id,
            value: 'Something'
          }
        ]
      };

      const expected = { subpurpose_other: id };

      assert.deepEqual(transformProc(proc, ropUpdates), expected);
    });

    it('adds the correct id', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_subpurposes: 'other-efficacy'
      };

      const id = uuid();

      const ropUpdates = {
        regulatory_subpurposes_other: [
          {
            id: uuid(),
            value: 'Something'
          }
        ],
        regulatory_subpurposes_other_efficacy: [
          {
            id,
            value: 'Something else'
          }
        ]
      };

      const expected = { subpurpose_other: id };

      assert.deepEqual(transformProc(proc, ropUpdates), expected);
    });

    it('adds relevant id to return if other legislation', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_legislation: 'other'
      };

      const id = uuid();

      const ropUpdates = {
        regulatory_legislation_other: [
          {
            id,
            value: 'Something'
          }
        ]
      };

      const expected = { legislation_other: id };

      assert.deepEqual(transformProc(proc, ropUpdates), expected);
    });

    it('adds both ids to return if other legislation and other subpurpose', () => {
      const proc = {
        purposes: 'regulatory',
        regulatory_subpurposes: 'other-efficacy',
        regulatory_legislation: 'other'
      };

      const id1 = uuid();
      const id2 = uuid();

      const ropUpdates = {
        regulatory_subpurposes_other_efficacy: [
          {
            id: id1,
            value: 'A'
          }
        ],
        regulatory_legislation_other: [
          {
            id: id2,
            value: 'Thing'
          }
        ]
      };

      const expected = { subpurpose_other: id1, legislation_other: id2 };

      assert.deepEqual(transformProc(proc, ropUpdates), expected);
    });
  });

  describe('translational', () => {
    it('returns null if no subpurposes', () => {
      const proc = {
        purposes: 'translational'
      };
      assert.equal(transformProc(proc, {}), null);
    });

    it('returns null if no other subpurposes', () => {
      const proc = {
        purposes: 'translational',
        translational_subpurposes: 'cancer'
      };
      assert.equal(transformProc(proc, {}), null);
    });

    it('returns id from rop if other', () => {
      const proc = {
        purposes: 'translational',
        translational_subpurposes: 'other'
      };
      const id = uuid();
      const ropUpdates = {
        translational_subpurposes_other: [
          {
            id,
            value: 'Something'
          }
        ]
      };
      const expected = { subpurpose_other: id };
      assert.deepEqual(transformProc(proc, ropUpdates), expected);
    });
  });
});

describe('up', () => {

  const ids = {
    rop: uuid(),
    project: uuid(),
    licenceHolder: uuid(),
    basicSubpurposesOther: uuid(),
    basicSubpurposesNotOther: uuid(),
    regulatorySubpurposesOther: uuid(),
    regulatoryLegislation: uuid(),
    regulatoryLegislationAndOther: uuid(),
    translationalSubpurposesOther: uuid()
  };

  const licenceHolder = {
    id: ids.licenceHolder,
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

  const project = {
    id: ids.project,
    licence_holder_id: ids.licenceHolder,
    title: 'Test project',
    status: 'active',
    establishment_id: 100
  };

  const rop = {
    id: ids.rop,
    year: 2021,
    project_id: ids.project,
    basic_subpurposes_other: JSON.stringify('Basic subpurposes other'),
    regulatory_subpurposes_other: JSON.stringify('Regulatory subpurposes other'),
    regulatory_subpurposes_other_efficacy: JSON.stringify('Regulatory subpurposes other efficacy'),
    regulatory_subpurposes_other_toxicity: JSON.stringify('Regulatory subpurposes other toxicity'),
    regulatory_subpurposes_other_toxicity_ecotoxicity: JSON.stringify('Regulatory subpurposes other toxicity ecotoxicity'),
    regulatory_legislation_other: JSON.stringify('Regulatory legislation other'),
    translational_subpurposes_other: JSON.stringify('Translational subpurposes other')
  };

  const procedures = [
    {
      id: ids.basicSubpurposesOther,
      rop_id: ids.rop,
      species: 'mouse',
      ga: false,
      severity: 'mild',
      severity_num: 10,
      new_genetic_line: false,
      purposes: 'basic',
      basic_subpurposes: 'other'
    },
    {
      id: ids.basicSubpurposesNotOther,
      rop_id: ids.rop,
      species: 'mouse',
      ga: false,
      severity: 'mild',
      severity_num: 10,
      new_genetic_line: false,
      purposes: 'basic',
      basic_subpurposes: 'oncology'
    },
    {
      id: ids.regulatorySubpurposesOther,
      rop_id: ids.rop,
      species: 'mouse',
      ga: false,
      severity: 'mild',
      severity_num: 10,
      new_genetic_line: false,
      purposes: 'regulatory',
      regulatory_subpurposes: 'routine-other'
    },
    {
      id: ids.regulatoryLegislation,
      rop_id: ids.rop,
      species: 'mouse',
      ga: false,
      severity: 'mild',
      severity_num: 10,
      new_genetic_line: false,
      purposes: 'regulatory',
      regulatory_subpurposes: 'qc-batch-safety',
      regulatory_legislation: 'other'
    },
    {
      id: ids.regulatoryLegislationAndOther,
      rop_id: ids.rop,
      species: 'mouse',
      ga: false,
      severity: 'mild',
      severity_num: 10,
      new_genetic_line: false,
      purposes: 'regulatory',
      regulatory_subpurposes: 'other-efficacy',
      regulatory_legislation: 'other'
    },
    {
      id: ids.translationalSubpurposesOther,
      rop_id: ids.rop,
      species: 'mouse',
      ga: false,
      severity: 'mild',
      severity_num: 10,
      new_genetic_line: false,
      purposes: 'translational',
      translational_subpurposes: 'other'
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
      .then(() => this.knex('projects').insert(project))
      .then(() => this.knex('rops').insert(rop))
      .then(() => this.knex('procedures').insert(procedures))
      .then(() => up(this.knex));
  });

  afterEach(() => {
    return db.clean(this.knex);
  });

  after(() => {
    return this.knex.destroy();
  });

  it('updates `other` fields to arrays of objects with ids', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updated => {
        Object.keys(omit(rop, 'id', 'year', 'project_id')).forEach(key => {
          const item = updated[key];
          assert.ok(Array.isArray(item));
          assert.equal(item.length, 1);
          assert.ok(isUuid(item[0].id));
          assert.equal(item[0].value, JSON.parse(rop[key]));
        });
      });
  });

  it('sets ids from other subpurposes to procs', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updatedRop => {
        return Promise.resolve()
          .then(() => this.knex('procedures').where('id', ids.basicSubpurposesOther).first())
          .then(proc => {
            assert.ok(proc.subpurpose_other);
            assert.equal(proc.legislation_other, null);
            assert.ok(isUuid(proc.subpurpose_other));
            assert.equal(proc.subpurpose_other, updatedRop.basic_subpurposes_other[0].id);
          });
      });
  });

  it('doesnt update if no others', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updatedRop => {
        return Promise.resolve()
          .then(() => this.knex('procedures').where('id', ids.basicSubpurposesNotOther).first())
          .then(proc => {
            assert.equal(proc.legislation_other, null);
            assert.equal(proc.legislation_other, null);
          });
      });
  });

  it('sets ids from other subpurposes to procs', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updatedRop => {
        return Promise.resolve()
          .then(() => this.knex('procedures').where('id', ids.regulatorySubpurposesOther).first())
          .then(proc => {
            assert.ok(proc.subpurpose_other);
            assert.equal(proc.legislation_other, null);
            assert.ok(isUuid(proc.subpurpose_other));
            assert.equal(proc.subpurpose_other, updatedRop.regulatory_subpurposes_other[0].id);
          });
      });
  });

  it('sets ids from other legislation to procs', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updatedRop => {
        return Promise.resolve()
          .then(() => this.knex('procedures').where('id', ids.regulatoryLegislation).first())
          .then(proc => {
            assert.ok(proc.legislation_other);
            assert.equal(proc.subpurpose_other, null);
            assert.ok(isUuid(proc.legislation_other));
            assert.equal(proc.legislation_other, updatedRop.regulatory_legislation_other[0].id);
          });
      });
  });

  it('sets ids from other subpurpose and legislation to procs', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updatedRop => {
        return Promise.resolve()
          .then(() => this.knex('procedures').where('id', ids.regulatoryLegislationAndOther).first())
          .then(proc => {
            assert.ok(proc.subpurpose_other);
            assert.ok(proc.legislation_other);
            assert.ok(isUuid(proc.subpurpose_other));
            assert.ok(isUuid(proc.legislation_other));
            assert.equal(proc.subpurpose_other, updatedRop.regulatory_subpurposes_other_efficacy[0].id);
            assert.equal(proc.legislation_other, updatedRop.regulatory_legislation_other[0].id);
          });
      });
  });

  it('sets ids from other subpurpose to procs', () => {
    return Promise.resolve()
      .then(() => this.knex('rops').where('id', ids.rop).first())
      .then(updatedRop => {
        return Promise.resolve()
          .then(() => this.knex('procedures').where('id', ids.translationalSubpurposesOther).first())
          .then(proc => {
            assert.ok(proc.subpurpose_other);
            assert.equal(proc.legislation_other, null);
            assert.ok(isUuid(proc.subpurpose_other));
            assert.equal(proc.subpurpose_other, updatedRop.translational_subpurposes_other[0].id);
          });
      });
  });
});
