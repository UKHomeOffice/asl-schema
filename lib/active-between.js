module.exports = ({ query, startDate, endDate, table }) => {
  const issueDate = table ? `${table}.issueDate` : 'issueDate';
  const revocationDate = table ? `${table}.revocationDate` : 'revocationDate';
  return query
    .where(issueDate, '<=', endDate)
    .where(builder => {
      builder
        // not revoked
        .whereNull(revocationDate)
        .orWhere(builder => {
          builder
            // revoked during period
            .where(revocationDate, '>=', startDate)
            .where(revocationDate, '<=', endDate);
        })
        // revoked after period
        .orWhere(revocationDate, '>', endDate);
    });
};
