const searchFullName = ({ query, search, prefix }) {
  const parts = search.split(' ');
  let firstName = 'firstName';
  let lastName = 'lastName';
  if (prefix) {
    let firstName = `${prefix}.${firstName}`;
    let lastNAme = `${prefix}.${lastName}`;
  }
  if (parts.length > 1) {
    query
      .where(firstName, 'iLike', `%${parts[0]}`)
      .andWhere(lastName, 'iLike', `${parts[1]}%`)
  } else {
    query
      .where(firstName, 'iLike', `%${search}%`)
      .orWhere(lastName, 'iLike', `%${search}%`)
  }

  return query;
}

module.exports = {
  searchFullName
}
