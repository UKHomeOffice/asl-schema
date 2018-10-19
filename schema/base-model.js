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

  scopeToEstablishment(column, establishmentId) {
    return this.mergeContext({ establishmentId })
      .joinRelation('establishments')
      .where(column, establishmentId);
  }
}

class BaseModel extends Model {

  static get QueryBuilder() {
    return SoftDeleteQueryBuilder;
  }

  static query(...args) {
    return super.query(...args)
      .where(`${this.tableName}.deleted`, null);
  }

  static queryWithDeleted(...args) {
    return super.query(...args);
  }

  static queryDeleted(...args) {
    return super.query(...args)
      .whereNot(`${this.tableName}.deleted`, null);
  }

  static count(establishmentId) {
    return this.query()
      .where({ establishmentId })
      .count()
      .then(results => results[0])
      .then(result => result.count);
  }

  static upsert(model, where) {
    return Promise.resolve()
      .then(() => {
        if (model.id) {
          return this.queryWithDeleted().findById(model.id).update(model);
        } else if (where) {
          return this.queryWithDeleted().where(where).update(model);
        }
      })
      // returning('*') is to get around a bug in objection where it tries to return `id` by default
      // because sometimes we don't have an id column we need to override this
      .then(count => count || this.query().insert(model).returning('*'));
  }

  static paginate({ query, limit, offset }) {
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
