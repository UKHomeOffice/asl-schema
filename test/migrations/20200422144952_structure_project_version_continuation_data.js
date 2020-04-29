const sinon = require('sinon');
const moment = require('moment');
const uuid = require('uuid');
const assert = require('assert');
const diff = require('deep-diff');
const { get, map } = require('lodash');
const db = require('./helpers/db');
const { up, transform } = require('../../migrations/20200422144952_structure_project_version_continuation_data');

const DATE_FORMAT = 'YYYY-MM-DD';
let spy;

function slateify(input) {
  return `{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"${input}","marks":[]}]}]}}`;
}

describe('transform', () => {
  beforeEach(() => {
    spy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    spy.restore();
  });

  it('returns undefined if data is missing', () => {
    assert.deepEqual(transform(), undefined);
  });

  it('returns undefined if the expiring-yes question is missing', () => {
    const data = {
      title: 'a title'
    };
    assert.deepEqual(transform(data), undefined);
  });

  it('returns undefined if the project-continuation field is defined (already patched)', () => {
    const data = {
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': moment().format(DATE_FORMAT)
        }
      ]
    };
    assert.deepEqual(transform(data), undefined);
  });

  it('returns undefined if neither licence number or expiry day found.', () => {
    const versionId = uuid();
    const input = 'Some text here';
    const data = {
      'expiring-yes': slateify(input)
    };
    assert.deepEqual(transform(data, versionId), undefined);
    assert.ok(spy.calledWith(`Cannot parse versionId: ${versionId}`));
  });

  it('adds a single project continuation if licence number found but no expiry date.', () => {
    const versionId = uuid();
    const input = 'Licence number: P12345678';
    const data = {
      'expiring-yes': slateify(input)
    };
    const expected = {
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': null
        }
      ]
    };
    assert.deepEqual(transform(data, versionId), expected);
    assert.ok(spy.calledWith(`Unable to parse expiry date, versionId: ${versionId}`));
  });

  it('adds a single project continuation if expiry date but no licence number found.', () => {
    const versionId = uuid();
    const input = 'Expiry date: 01/01/2020';
    const data = {
      'expiring-yes': slateify(input)
    };
    const expected = {
      'project-continuation': [
        {
          'licence-number': null,
          'expiry-date': '2020-01-01'
        }
      ]
    };
    assert.deepEqual(transform(data, versionId), expected);
    assert.ok(spy.calledWith(`Unable to parse licence number, versionId: ${versionId}`));
  });

  it('adds a single project continuation if both licence number and expiry date found.', () => {
    const versionId = uuid();
    const input = 'Licence number: P12345678, Expiry date: 01/01/2020';
    const data = {
      'expiring-yes': slateify(input)
    };
    const expected = {
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-01-01'
        }
      ]
    };
    assert.deepEqual(transform(data, versionId), expected);
    assert.ok(spy.calledWith(`Successfully parsed version, versionId: ${versionId}`));
  });

  it('Adds the first licence number and logs a warning if multiple found.', () => {
    const versionId = uuid();
    const input = 'Licence number: P12345678, also from P87654321, Expiry date: 01/01/2020';
    const data = {
      'expiring-yes': slateify(input)
    };
    const expected = {
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-01-01'
        }
      ]
    };
    assert.deepEqual(transform(data, versionId), expected);
    assert.ok(spy.calledWith(`Multple licence numbers found for versionId: ${versionId}`));
  });

  it('parses old style slate leaves', () => {
    const versionId = uuid();
    const data = {
      'expiring-yes': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"P12345678","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"27 Feb 2020","marks":[]}]}]}]}}'
    };
    const expected = {
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-02-27'
        }
      ]
    }
    assert.deepEqual(transform(data, versionId), expected);
  });

  describe('licence number parsing', () => {
    it('parses various valid licence number', () => {
      const valid = [
        'P12345678',
        'P1234ABCD',
        'PABCD1234',
        '70/1234',
        '7001234',
        '70-1234',
        '30/5678',
        '3005678',
        '30-5678'
      ];

      valid.forEach(licenceNumber => {
        const versionId = uuid();
        const data = {
          'expiring-yes': slateify(licenceNumber.toString())
        };
        const expected = {
          'project-continuation': [
            {
              'licence-number': licenceNumber,
              'expiry-date': null
            }
          ]
        }
        assert.deepEqual(transform(data, versionId), expected, `Expected ${licenceNumber} to be parsed successfully`);
      });
    });

    it('ignores invalid licence numbers', () => {
      const invalid = [
        'P1234567',
        '112345678',
        'C1234ABCD',
        '1ABCD1234',
        '71/1234',
        '7041234',
        '70+1234',
        '31/5678',
        '3015678',
        '30*5678'
      ];

      invalid.forEach(licenceNumber => {
        const versionId = uuid();
        const data = {
          'expiring-yes': slateify(licenceNumber.toString())
        };
        assert.equal(transform(data, versionId), undefined, `Expected ${licenceNumber} to be skipped`);
      });
    });
  });

  describe('expiry dates', () => {
    it('parses various valid expiry dates', () => {
      const valid = [
        '1st January 2020',
        '1 January 20',
        '1 Jan 20',
        '01/01/2020',
        '01-01-2020',
        '01 01 2020',
        '01.01.2020'
      ];

      valid.forEach(expiryDate => {
        const versionId = uuid();
        const data = {
          'expiring-yes': slateify(expiryDate)
        };
        const expected = {
          'project-continuation': [
            {
              'licence-number': null,
              'expiry-date': '2020-01-01'
            }
          ]
        }
        assert.deepEqual(transform(data, versionId), expected, `Expected ${expiryDate} to be parsed successfully`);
      });
    });

    it('parses various versions of month names', () => {
      const valid = [
        '1st January 2020',
        '2nd Jan 2020',
        '3rd February 2020',
        '4th Feb 2020',
        '5th March 2020',
        '1st Mar 2020',
        '1st April 2020',
        '1st Apr 2020',
        '1st May 2020',
        '1st June 2020',
        '1st Jun 2020',
        '1st July 2020',
        '1st Jul 2020',
        '1st August 2020',
        '1st Aug 2020',
        '1st September 2020',
        '1st Sept 2020',
        '1st Sep 2020',
        '1st October 2020',
        '1st Oct 2020',
        '1st November 2020',
        '1st Nov 2020',
        '1st December 2020',
        '1st Dec 2020'
      ];

      valid.forEach(expiryDate => {
        const versionId = uuid();
        const data = {
          'expiring-yes': slateify(expiryDate)
        };
        const output = transform(data, versionId);
        assert.ok(get(output, 'project-continuation[0].expiry-date'), `Expected ${expiryDate} to be parsed successfully`);
      });
    });
  });
});

describe('up', () => {
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

  const ids = {
    VALID_INPUT: uuid(),
    INVALID_INPUT: uuid(),
    INVALID_DATE: uuid(),
    INVALID_LICENCE_NUMBER: uuid(),
    MULTIPLE_LICENCE_NUMBERS: uuid(),
    LEGACY_SLATE_FORMAT: uuid()
  }

  const continuations = {
    [ids.VALID_INPUT]: slateify('70/8123 valid until 20/04/2020'),
    [ids.INVALID_INPUT]: slateify('If yes, you will need to create an authorisation for this continued use.'),
    [ids.INVALID_DATE]: slateify('Some text here from 70/1123, expires May 2020'),
    [ids.INVALID_LICENCE_NUMBER]: slateify('P1CD27BB - expires 26/01/2020'),
    [ids.MULTIPLE_LICENCE_NUMBERS]: slateify('continuation from 70/8123 and 30/1234, expiry 20/01/2020'),
    [ids.LEGACY_SLATE_FORMAT]: '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"PA1234567","marks":[]}]}]},{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"27 Feb 2020","marks":[]}]}]}]}}'
  };

  before(() => {
    this.knex = db.init();
  });

  beforeEach(() => {
    return Promise.resolve()
      .then(() => db.clean(this.knex))
      .then(() => this.knex('establishments').insert(establishment))
      .then(() => this.knex('profiles').insert(licenceHolder))
      .then(() => {
        let index = 0
        return Promise.all(map(continuations, (continuation, id) => {
          const project = {
            establishment_id: establishment.id,
            title: `Continuation ${++index}`,
            status: 'active',
            licence_holder_id: licenceHolder.id
          };
          const projectVersion = {
            id,
            status: 'granted',
            data: {
              'transfer-expiring': true,
              'expiring-yes': continuation
            }
          };
          return this.knex('projects').insert(project).returning('id')
            .then(ids => ids[0])
            .then(id => this.knex('project_versions').insert({ ...projectVersion, project_id: id }))
        }));
      });
  });

  it('adds licence number and expiry date as a project-continuation', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.VALID_INPUT }).first())
      .then(before => {
        const expected = {
          ...before.data,
          'project-continuation': [
            {
              'licence-number': '70/8123',
              'expiry-date': '2020-04-20'
            }
          ]
        }
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.VALID_INPUT }).first())
          .then(version => {
            assert.deepEqual(version.data, expected);
          });
      });

  });

  it('skips invalid input', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.INVALID_INPUT }).first())
      .then(before => {
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.INVALID_INPUT }).first())
          .then(version => {
            assert.deepEqual(version.data, before.data);
          });
      });
  });

  it('skips invalid date, adds licence number', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.INVALID_DATE }).first())
      .then(before => {
        const expected = {
          ...before.data,
          'project-continuation': [
            {
              'licence-number': '70/1123',
              'expiry-date': null
            }
          ]
        };
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.INVALID_DATE }).first())
          .then(version => {
            assert.deepEqual(version.data, expected);
          });
      });
  });

  it('skips invalid licence number, adds expiry', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.INVALID_LICENCE_NUMBER }).first())
      .then(before => {
        const expected = {
          ...before.data,
          'project-continuation': [
            {
              'licence-number': null,
              'expiry-date': '2020-01-26'
            }
          ]
        }
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.INVALID_LICENCE_NUMBER }).first())
          .then(version => {
            assert.deepEqual(version.data, expected);
          });
      });
  });

  it('adds the first licence number if multiple found', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.MULTIPLE_LICENCE_NUMBERS }).first())
      .then(before => {
        const expected = {
          ...before.data,
          'project-continuation': [
            {
              'licence-number': '70/8123',
              'expiry-date': '2020-01-20'
            }
          ]
        }
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.MULTIPLE_LICENCE_NUMBERS }).first())
          .then(version => {
            assert.deepEqual(version.data, expected);
          });
      });
  });

  it('can process legacy slate format (leaves)', () => {
    return Promise.resolve()
      .then(() => this.knex('project_versions').where({ id: ids.LEGACY_SLATE_FORMAT }).first())
      .then(before => {
        const expected = {
          ...before.data,
          'project-continuation': [
            {
              'licence-number': 'PA1234567',
              'expiry-date': '2020-02-27'
            }
          ]
        }
        return Promise.resolve()
          .then(() => up(this.knex))
          .then(() => this.knex('project_versions').where({ id: ids.LEGACY_SLATE_FORMAT }).first())
          .then(version => {
            assert.deepEqual(version.data, expected);
          });
      });
  });

});
