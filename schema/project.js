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
      required: ['title', 'establishmentId'],
      additionalProperties: false,
      properties: {
        id: { type: 'string', pattern: uuid.v4 },
        'migrated_id': { type: ['string', 'null'] },
        status: { type: 'string', enum: projectStatuses },
        title: { type: 'string' },
        issueDate: { type: ['string', 'null'], format: 'date-time' },
        expiryDate: { type: ['string', 'null'], format: 'date-time' },
        revocationDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        'created_at': { type: 'string', format: 'date-time' },
        'updated_at': { type: 'string', format: 'date-time' },
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
      .where({ establishmentId })
      .where({ licenceHolderId })
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

  static count({ query, establishmentId }) {
    query = query || this.query();

    return query
      .where({ establishmentId })
      .where('expiryDate', '>=', new Date())
      .count()
      .then(result => result[0].count);
  }

  static search({ query, establishmentId, search, sort = {}, limit, offset }) {
    query = query || this.query();

    query
      .distinct('projects.*')
      .where({ establishmentId })
      .where('expiryDate', '>=', new Date())
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
      }
    };
  }
}

module.exports = Project;
