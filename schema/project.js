const BaseModel = require('./base-model');
const Profile = require('./profile');
const { projectStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');

const statusQuery = status => query => Array.isArray(status)
  ? query.whereIn('projects.status', status)
  : query.where('projects.status', status);

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
        deleted: { type: ['string', 'null'], format: 'date-time' },
        amendedDate: { type: ['string', 'null'], format: 'date-time' },
        isLegacyStub: { type: 'boolean' },
        transferredInDate: { type: ['string', 'null'], format: 'date-time' },
        transferredOutDate: { type: ['string', 'null'], format: 'date-time' },
        previousProjectId: { type: ['string', 'null'], pattern: uuid.v4 },
        previousEstablishmentId: { type: ['integer', 'null'] },
        transferProjectId: { type: ['string', 'null'], pattern: uuid.v4 },
        transferEstablishmentId: { type: ['integer', 'null'] }
      }
    };
  }

  static scopeToParams(params) {
    if (params.status === 'inactive-statuses') {
      params.status = ['expired', 'revoked', 'transferred'];
    }
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

  static filterUnsubmittedDrafts(query) {
    return query.joinRelation('version')
      .where('version.status', '!=', 'draft');
  }

  static count({ query, establishmentId, status, isAsru }) {
    query = query || this.query();

    if (status === 'inactive' && isAsru) {
      query = this.filterUnsubmittedDrafts(query);
    }

    return query
      .where({ establishmentId })
      .where(statusQuery(status))
      .countDistinct('projects.id')
      .then(result => result[0])
      .then(result => parseInt(result.count, 10));
  }

  static search({ query, establishmentId, search, status = 'active', sort = {}, limit, offset, isAsru }) {
    query = query || this.query();

    if (status === 'inactive' && isAsru) {
      query = this.filterUnsubmittedDrafts(query);
    }

    query
      .distinct('projects.*', 'licenceHolder.lastName')
      .where({ establishmentId })
      .where(statusQuery(status))
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
