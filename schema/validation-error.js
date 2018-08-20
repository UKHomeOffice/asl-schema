class ValidationError extends Error {
  constructor(error) {
    if (typeof error === 'string') {
      super(error);
    } else if (typeof error === 'object') {
      super();
      Object.assign(this, error);
    } else {
      super('validation error');
    }

    this.name = this.constructor.name;
    this.status = 400;
  }
}

module.exports = ValidationError;
