const { isUndefined } = require('lodash');
const { Model } = require('objection');

class SoftDeleteQueryBuilder extends Model.QueryBuilder {
  delete() {
    this.mergeContext({
      softDelete: true
    });

    return this.patch({
      deleted: Model.fn().now()
    });
  }

  unDelete() {
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
}

module.exports = BaseModel;
