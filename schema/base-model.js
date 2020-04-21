const { isUndefined } = require('lodash');
const { Model } = require('objection');
const ValidationError = require('./validation-error');

class SoftDeleteQueryBuilder extends Model.QueryBuilder {
  delete() {
    this.mergeContext({
      softDelete: true
    });

    return this.patch({
      deleted: this.knex().fn.now()
    });
  }

  undelete() {
    this.mergeContext({
      undelete: true
    });
    return this.patch({
      deleted: null
    });
  }

  hardDelete() {
    return super.delete();
  }

  scopeToEstablishment(column, establishmentId, role) {
    const query = this.mergeContext({ establishmentId })
      .joinRelation('establishments')
      .where(column, establishmentId);

    if (role) {
      query.where({ role });
    }

    return query;
  }
}

class BaseModel extends Model {
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get QueryBuilder() {
    return SoftDeleteQueryBuilder;
  }

  static query(...args) {
    return super.query(...args)
      .onBuild(builder => {
        if (!builder.context().withDeleted) {
          return builder.whereNull(`${builder.tableRefFor(builder.modelClass())}.deleted`);
        }
      });
  }

  static queryWithDeleted(...args) {
    return this.query(...args).context({ withDeleted: true });
  }

  static queryDeleted(...args) {
    return super.query(...args)
      .whereNot(`${this.tableName}.deleted`, null);
  }

  static count(establishmentId, query) {
    return (query || this.query())
      .where({ establishmentId })
      .countDistinct(`${this.tableName}.id`)
      .then(results => results[0])
      .then(result => parseInt(result.count, 10));
  }

  static upsert(model, where, transaction) {
    return Promise.resolve()
      .then(() => {
        if (model.id) {
          return this.queryWithDeleted(transaction).findById(model.id).update({ deleted: null, ...model });
        } else if (where) {
          return this.queryWithDeleted(transaction).where(where).update({ deleted: null, ...model });
        }
      })
      // returning('*') is to get around a bug in objection where it tries to return `id` by default
      // because sometimes we don't have an id column we need to override this
      .then(count => count || this.query(transaction).insert(model).returning('*'));
  }

  static paginate({ query, limit, offset }) {
    if (limit === 'all') {
      // .page() requires an integer argument - provide an arbitrarily large on
      return query.page(0, 1e9);
    }
    if (isUndefined(limit)) {
      limit = 100;
    }
    if (isUndefined(offset)) {
      offset = 0;
    }
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    const page = offset / limit;

    return query
      .page(page, limit);
  }

  static orderBy({ query, sort = {} }) {
    if (!sort.column) {
      return query;
    }
    return query
      .orderBy(sort.column, sort.ascending === 'true' ? 'asc' : 'desc');
  }

  static validate(data) {
    try {
      this.fromJson(data);
    } catch (error) {
      return new ValidationError(error);
    }
  }
}

module.exports = BaseModel;
