const { isUndefined } = require('lodash');
const { Model } = require('objection');

class BaseModel extends Model {
  static count(establishmentId) {
    return this.query()
      .where({ establishmentId })
      .count()
      .then(result => result[0].count);
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
