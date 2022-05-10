const { Model } = require('objection');

const SoftDelete = require('./mixins/soft-delete');
const NameSearch = require('./mixins/name-search');

class QueryBuilder extends Model.QueryBuilder {

  static mixin(mx) {
    return mx(this);
  }

  scopeToEstablishment(column, establishmentId, role) {
    const query = this.context({ establishmentId })
      .joinRelation('establishments')
      .where(column, establishmentId);

    if (role) {
      query.where({ role });
    }

    return query;
  }
}

QueryBuilder.NameSearch = NameSearch;

module.exports = QueryBuilder.mixin(SoftDelete);
