/*
  returns an arbitrary but consistent item from a list depending on the string
  passed as a second argument
*/

module.exports = (list, str) => {
  const i = str.split('').reduce((n, c) => n + c.charAt(0), 0) % list.length;
  if (isNaN(i)) {
    return list[0].id;
  }
  return list[i].id;
};
