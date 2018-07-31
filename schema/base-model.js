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
    if (isUndefined(limit) || isUndefined(offset)) {
      return query;
    }
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    const page = offset / limit;

    return query
      .page(page, limit);
  }

  static orderBy({ query, sort }) {
    return query
      .orderBy(sort.column, sort.ascending === 'true' ? 'asc' : 'desc');
  }
}

module.exports = BaseModel;
