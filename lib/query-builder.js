const { mergeWith, set, get } = require('lodash');

class QueryBuilder {
  constructor(Model, query = {}) {
    this.Model = Model;
    this._query = query;
  }

  _addToQuery(obj) {
    mergeWith(this._query, obj, (a, b) => {
      if (Array.isArray(a)) {
        return a.concat(b);
      }
    });
    return this;
  }

  _extendQuery(obj) {
    Object.assign(this._query, obj);
    return this;
  }

  where(where) {
    set(this._query, 'where', Object.assign(get(this._query, 'where') || {}, where));
    return this;
  }

  include(model, options = {}) {
    return this._addToQuery({
      include: [{
        model,
        ...options,
        duplicating: false
      }]
    });
  }

  order(order) {
    return this._addToQuery({ order });
  }

  paginate({ limit, offset }) {
    return this._addToQuery({ limit, offset });
  }

  exec(method) {
    return this.Model[method](this._query);
  }
}

module.exports = QueryBuilder;
