const BaseModel = require('./base-model');
const Profile = require('./profile');
const { projectStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

class Project extends BaseModel {
  static get tableName() {
    return 'projects';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['establishmentId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        migratedId: { type: ['string', 'null'] },
        schemaVersion: { type: 'integer' },
        status: { type: 'string', enum: projectStatuses },
        title: { type: ['string', 'null'] },
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        expiryDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        licenceHolderId: { type: ['string', 'null'] },
        deleted: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static scopeToParams(params) {
    return {
      getAll: () => this.getProjects(params),
      getOwn: () => this.getOwnProjects(params)
    };
  }

  static scopeSingle(params) {
    return {
      get: () => this.get(params),
      getOwn: () => this.getOwn(params)
    };
  }

  static get({ establishmentId, id }) {
    return this.query()
      .where({ establishmentId })
      .findById(id)
      .eager('licenceHolder');
  }

  static getOwn({ establishmentId, id, licenceHolderId }) {
    return this.query()
      .where({ establishmentId, licenceHolderId })
      .findById(id)
      .eager('licenceHolder');
  }

  static getOwnProjects({
    licenceHolderId,
    ...props
  }) {
    return Promise.all([
      this.count({ query: this.query().where({ licenceHolderId }), ...props }),
      this.search({ query: this.query().where({ licenceHolderId }), ...props })
    ])
      .then(([total, projects]) => ({ total, projects }));
  }

  static getProjects(props) {
    return Promise.all([
      this.count(props),
      this.search(props)
    ])
      .then(([total, projects]) => ({ total, projects }));
  }

  static count({ query, establishmentId, status }) {
    query = query || this.query();

    return query
      .where({ establishmentId })
      .andWhere(builder => {
        if (status === 'expired') {
          return builder.where('expiryDate', '<', new Date()).orWhere({ status: 'expired' });
        }
        return builder.where({ status })
          .andWhere(builder => builder.where('expiryDate', '>=', new Date()).orWhereNull('expiryDate'));
      })
      .count()
      .then(result => result[0].count);
  }

  static search({ query, establishmentId, search, status = 'active', sort = {}, limit, offset }) {
    query = query || this.query();

    query
      .distinct('projects.*', 'licenceHolder.lastName')
      .where({ establishmentId })
      .andWhere(builder => {
        if (status === 'expired') {
          return builder.where('expiryDate', '<', new Date()).orWhere({ status: 'expired' });
        }
        return builder.where({ status })
          .andWhere(builder => builder.where('expiryDate', '>=', new Date()).orWhereNull('expiryDate'));
      })
      .leftJoinRelation('licenceHolder')
      .eager('licenceHolder')
      .where(builder => {
        if (search) {
          return builder
            .where('projects.title', 'iLike', `%${search}%`)
            .orWhere('licenceNumber', 'iLike', `%${search}%`)
            .orWhere(b => {
              Profile.searchFullName({
                search,
                prefix: 'licenceHolder',
                query: b
              });
            });
        }
      });

    if (sort.column) {
      query = this.orderBy({ query, sort });
    } else {
      query.orderBy('expiryDate');
    }

    query = this.paginate({ query, limit, offset });

    return query;
  }

  static get relationMappings() {
    return {
      licenceHolder: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'projects.licenceHolderId',
          to: 'profiles.id'
        }
      },
      establishment: {
        relation: this.BelongsToOneRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'projects.establishmentId',
          to: 'establishments.id'
        }
      },
      version: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/project-version`,
        join: {
          from: 'projects.id',
          to: 'projectVersions.projectId'
        }
      }
    };
  }
}

module.exports = Project;
