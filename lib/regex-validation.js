/**
 * Note: regexes must be specified as strings otherwise they won't work in the jsonSchema.
 * You must also escape backslashes, omit the delimiters, and avoid using flags.
 */
module.exports = {
  uuid: {
    v4: '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}$'
  },
  date: {
    // yyyy-mm-dd only
    yearMonthDay: '^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'
  }
};
