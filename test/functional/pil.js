const assert = require('assert');
const db = require('./helpers/db');

describe('PIL model', () => {

  before(() => {
    return Promise.resolve()
      .then(() => {
        this.models = db.init();
      })
      .then(() => db.clean(this.models));
  });

  after(() => {
    return db.clean(this.models)
      .then(() => this.models.destroy());
  });

  describe('billable', () => {

    before(() => {
      return this.models.Establishment.query().insertGraph([
        {
          id: 100,
          name: 'Establishment 1'
        },
        {
          id: 101,
          name: 'Establishment 2'
        },
        {
          id: 102,
          name: 'Establishment 3',
          profiles: [
            {
              firstName: 'Active',
              lastName: 'Pil',
              email: 'activepil@example.com',
              pil: {
                establishmentId: 102,
                procedures: ['A'],
                status: 'active',
                issueDate: '2018-01-01T12:00:00Z'
              }
            },
            {
              firstName: 'Revoked',
              lastName: 'Pil',
              email: 'revokedpil@example.com',
              pil: {
                establishmentId: 102,
                procedures: ['A'],
                status: 'revoked',
                issueDate: '2018-01-01T12:00:00Z',
                revocationDate: '2018-02-01T12:00:00Z'
              }
            },
            {
              firstName: 'Transfered',
              lastName: 'Pil',
              email: 'transferedpil@example.com',
              pil: {
                establishmentId: 102,
                procedures: ['A'],
                status: 'active',
                issueDate: '2018-01-01T12:00:00Z',
                pilTransfers: [
                  {
                    fromEstablishmentId: 101,
                    toEstablishmentId: 102,
                    createdAt: '2019-05-01T12:00:00Z'
                  }
                ]
              }
            },
            {
              firstName: 'Multiple',
              lastName: 'Transfers',
              email: 'manytransfers@example.com',
              pil: {
                establishmentId: 102,
                procedures: ['A'],
                status: 'active',
                issueDate: '2016-01-01T12:00:00Z',
                pilTransfers: [
                  {
                    fromEstablishmentId: 102,
                    toEstablishmentId: 101,
                    createdAt: '2016-03-01T12:00:00Z'
                  },
                  {
                    fromEstablishmentId: 101,
                    toEstablishmentId: 100,
                    createdAt: '2018-06-01T12:00:00Z'
                  },
                  {
                    fromEstablishmentId: 100,
                    toEstablishmentId: 101,
                    createdAt: '2019-04-01T12:00:00Z'
                  },
                  {
                    fromEstablishmentId: 101,
                    toEstablishmentId: 102,
                    createdAt: '2019-05-01T12:00:00Z'
                  }
                ]
              }
            }
          ]
        }
      ]);
    });

    const isBillable = (results, email) => {
      const emails = results.map(pil => pil.profile.email);
      assert.ok(emails.includes(email), `Billable PIL list should contain PIL for ${email}`);
      return results;
    };

    const isNotBillable = (results, email) => {
      const emails = results.map(pil => pil.profile.email);
      assert.ok(!emails.includes(email), `Billable PIL list should not contain PIL for ${email}`);
      return results;
    };

    it('exposes a `billable` query method', () => {
      const { PIL } = this.models;
      return assert.equal(typeof PIL.query().billable, 'function');
    });

    it('includes PILs which were valid in the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 102, start: '2018-04-06', end: '2019-04-05' })
        .then(results => isBillable(results, 'activepil@example.com'));
    });

    it('does not include PILs which were revoked before the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 102, start: '2018-04-06', end: '2019-04-05' })
        .then(results => isNotBillable(results, 'revokedpil@example.com'));
    });

    it('does not include PILs which were granted after the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 102, start: '2016-04-06', end: '2017-04-05' })
        .then(results => isNotBillable(results, 'activepil@example.com'));
    });

    it('does not include PILs which were transfered into the establishment after the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 102, start: '2018-04-06', end: '2019-04-05' })
        .then(results => isNotBillable(results, 'transferedpil@example.com'));
    });

    it('includes PILs which were transfered out of the establishment after the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 101, start: '2018-04-06', end: '2019-04-05' })
        .then(results => isBillable(results, 'transferedpil@example.com'));
    });

    it('includes PILs which were transferred out of the establishment during the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 101, start: '2019-04-06', end: '2020-04-05' })
        .then(results => isBillable(results, 'transferedpil@example.com'));
    });

    it('includes PILs which were transferred in and out of the establishment during the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 100, start: '2018-04-06', end: '2019-04-05' })
        .then(results => isBillable(results, 'manytransfers@example.com'));
    });

    it('includes PILs which were transferred in and out of the establishment either side the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 101, start: '2017-04-06', end: '2018-04-05' })
        .then(results => isBillable(results, 'manytransfers@example.com'));
    });

    it('does not include PILs which were transferred out of and into the establishment either side of the billing period', () => {
      return this.models.PIL.query().billable({ establishmentId: 102, start: '2018-04-06', end: '2019-04-05' })
        .then(results => isNotBillable(results, 'manytransfers@example.com'));
    });

  });

});
