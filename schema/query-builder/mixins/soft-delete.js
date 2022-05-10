module.exports = (Base) => {

  class Mixed extends Base {
    delete() {
      this.context({
        softDelete: true
      });

      return this.patch({
        deleted: this.knex().fn.now()
      });
    }

    undelete() {
      this.context({
        undelete: true
      });
      return this.patch({
        deleted: null
      });
    }

    hardDelete() {
      return super.delete();
    }
  }

  return Mixed;

};
