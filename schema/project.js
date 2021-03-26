const BaseModel = require('./base-model');
const { projectStatuses } = require('@asl/constants');
const { uuid } = require('../lib/regex-validation');
const moment = require('moment');

const QueryBuilder = require('./query-builder');

const statusQuery = status => query => Array.isArray(status)
  ? query.whereIn('projects.status', status)
  : query.where('projects.status', status);

function isDraftRelationAndProject(builder) {
  return builder
    .where('projectEstablishments.status', 'draft')
    .where('projects.status', 'inactive');
}

function isActiveRelationAndProject(builder) {
  return builder
    // include removed as establishments need to retain visibility of these
    .whereIn('projectEstablishments.status', ['active', 'removed'])
    .whereIn('projects.status', ['active', 'expired', 'revoked']);
}

function canSeeProject(builder) {
  return builder
    .where(isDraftRelationAndProject)
    .orWhere(isActiveRelationAndProject);
}

const hasAdditionalAvailability = establishmentId => builder => {
  builder
    .where('projectEstablishments.establishmentId', establishmentId)
    .where(canSeeProject);
};

class ProjectQueryBuilder extends QueryBuilder {

  whereTitleMatch(search) {
    if (Array.isArray(search)) {
      search = search[0];
    }
    const q = `to_tsvector(unaccent(projects.title)) @@ websearch_to_tsquery('${search}')`;

    return this.whereRaw(q);
  }

  whereIsCollaborator(profileId) {
    return this
      .where(builder => {
        return builder
          .where({ licenceHolderId: profileId })
          .orWhereExists(
            Project.relatedQuery('collaborators').where({ 'collaborators.id': profileId })
          );
      });
  }

  whereHasAvailability(establishmentId) {
    return this.where(builder => {
      builder
        .where('projects.establishmentId', establishmentId)
        .orWhere(builder => builder.whereHasAdditionalAvailability(establishmentId));
    });
  }

  whereHasAdditionalAvailability(establishmentId) {
    return this.whereExists(
      Project.relatedQuery('projectEstablishments').where(hasAdditionalAvailability(establishmentId))
    );
  }

  whereRopsDue(year) {
    return this.where('projects.issueDate', '<=', `${year}-12-31`)
      .andWhere(builder => {
        builder
          .where('projects.status', 'active')
          .orWhere(qb => {
            qb
              .where('projects.status', 'expired')
              .where('projects.expiryDate', '>=', `${year}-01-01`);
          })
          .orWhere(qb => {
            qb
              .where('projects.status', 'revoked')
              .where('projects.revocationDate', '>=', `${year}-01-01`);
          });
      });
  }

  whereRopsSubmitted(year) {
    return this.whereExists(
      Project.relatedQuery('rops')
        .where('year', year)
        .where('rops.status', 'submitted')
    );
  }

  whereRopsOutstanding(year) {
    return this.whereNotExists(
      Project.relatedQuery('rops')
        .where('year', year)
        .where('rops.status', 'submitted')
    );
  }

  withRops(year, ropsStatus) {
    const query = this.withGraphFetched('rops(constrainRops)')
      .modifiers({
        constrainRops: builder => {
          builder.where('rops.year', year);
          if (ropsStatus === 'submitted') {
            builder.where('rops.status', 'submitted');
          }
        }
      });

    if (ropsStatus === 'outstanding') {
      const endOfJanNextYear = moment(`${parseInt(year, 10) + 1}-01-31`).endOf('day').toISOString();
      const interval28Days = `INTERVAL '29 days - 1 millisecond'`;
      query.select(this.knex().raw(`
        CASE
          WHEN projects.status = 'active' THEN LEAST('${endOfJanNextYear}'::timestamptz, date_trunc('day', projects.expiry_date) + ${interval28Days})
          WHEN projects.status = 'expired' THEN DATE_TRUNC('day', projects.expiry_date) + ${interval28Days}
          WHEN projects.status = 'revoked' THEN DATE_TRUNC  ('day', projects.revocation_date) + ${interval28Days}
        END rops_deadline
      `));
    }

    if (ropsStatus === 'submitted') {
      query.select(
        Project.relatedQuery('rops')
          .select('updatedAt')
          .where('year', year)
          .where('rops.status', 'submitted')
          .as('ropsSubmittedDate')
      );
    }

    return query;
  }

}

class Project extends BaseModel {
  static get tableName() {
    return 'projects';
  }

  static get QueryBuilder() {
    return ProjectQueryBuilder.mixin(QueryBuilder.NameSearch);
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
        raDate: { type: ['string', 'null'], format: 'date-time' },
        raGrantedDate: { type: ['string', 'null'], format: 'date-time' },
        licenceNumber: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        establishmentId: { type: 'integer' },
        licenceHolderId: { type: ['string', 'null'] },
        deleted: { type: ['string', 'null'], format: 'date-time' },
        amendedDate: { type: ['string', 'null'], format: 'date-time' },
        isLegacyStub: { type: 'boolean' },
        species: {
          type: ['array', 'null'],
          items: { type: 'string' }
        },
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
      .where({ establishmentId })
      .whereIsCollaborator(licenceHolderId)
      .findById(id)
      .eager('licenceHolder');
  }

  static getOwnProjects({
    licenceHolderId,
    ...props
  }) {
    return Promise.all([
      this.count({ query: this.query().whereIsCollaborator(licenceHolderId), ...props }),
      this.search({ query: this.query().whereIsCollaborator(licenceHolderId), ...props })
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

  static count({ query, establishmentId, status, isAsru, ropsStatus, ropsYear }) {
    query = query || this.query();

    if (status === 'inactive' && isAsru) {
      query = this.filterUnsubmittedDrafts(query);
    }

    if (ropsStatus && ropsYear) {
      query.whereRopsDue(ropsYear);

      if (ropsStatus === 'submitted') {
        query.whereRopsSubmitted(ropsYear);
      } else if (ropsStatus === 'outstanding') {
        query.whereRopsOutstanding(ropsYear);
      }
    }

    return query
      .whereHasAvailability(establishmentId)
      .where(statusQuery(status))
      .countDistinct('projects.id')
      .then(result => result[0])
      .then(result => parseInt(result.count, 10));
  }

  static search({ query, establishmentId, search, status = 'active', sort = {}, limit, offset, isAsru, ropsStatus, ropsYear }) {
    query = query || this.query();

    if (status === 'inactive' && isAsru) {
      query = this.filterUnsubmittedDrafts(query);
    }

    query
      .distinct('projects.*', 'licenceHolder.lastName')
      .whereHasAvailability(establishmentId)
      .where(statusQuery(status))
      .leftJoinRelation('licenceHolder')
      .withGraphFetched('[licenceHolder, additionalEstablishments(constrainAAParams), establishment(constrainEstParams)]')
      .modifiers({
        constrainAAParams: builder => builder.select('id', 'name', 'projectEstablishments.status'),
        constrainEstParams: builder => builder.select('id', 'name')
      })
      .where(builder => {
        if (search) {
          return builder
            .whereTitleMatch(search)
            .orWhere('licenceNumber', 'iLike', `%${search}%`)
            .orWhere(b => b.whereNameMatch(search, 'licence_holder'));
        }
      });

    if (ropsStatus && ropsYear) {
      query.whereRopsDue(ropsYear)
        .withRops(ropsYear, ropsStatus);

      if (ropsStatus === 'submitted') {
        query.whereRopsSubmitted(ropsYear);
      } else if (ropsStatus === 'outstanding') {
        query.whereRopsOutstanding(ropsYear);
      }
    }

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
      projectEstablishments: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/project-establishment`,
        join: {
          from: 'projects.id',
          to: 'projectEstablishments.projectId'
        }
      },
      additionalEstablishments: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/establishment`,
        join: {
          from: 'projects.id',
          through: {
            from: 'projectEstablishments.projectId',
            to: 'projectEstablishments.establishmentId',
            extra: ['status', 'versionId']
          },
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
      },
      retrospectiveAssessments: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/retrospective-assessment`,
        join: {
          from: 'projects.id',
          to: 'retrospectiveAssessments.projectId'
        }
      },
      collaborators: {
        relation: this.ManyToManyRelation,
        modelClass: `${__dirname}/profile`,
        join: {
          from: 'projects.id',
          through: {
            from: 'projectProfiles.projectId',
            to: 'projectProfiles.profileId'
          },
          to: 'profiles.id'
        }
      },
      rops: {
        relation: this.HasManyRelation,
        modelClass: `${__dirname}/rop`,
        join: {
          from: 'projects.id',
          to: 'rops.projectId'
        }
      }
    };
  }
}

module.exports = Project;
