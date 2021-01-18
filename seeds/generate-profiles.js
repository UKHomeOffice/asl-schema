const faker = require('faker');
const uuid = require('uuid');

module.exports = ({ count, establishmentIds = [8202], roles = ['basic'], locale = 'en_GB' }) => {
  if (locale) {
    faker.locale = locale;
  }

  const uniqEmails = [];

  const generateEmail = (firstName, lastName) => {
    const email = faker.internet.email(
      Math.random() > 0.5 ? undefined : firstName,
      Math.random() > 0.5 ? undefined : lastName,
      'example.com'
    );

    // prevent dupe emails
    if (uniqEmails.includes(email)) {
      return generateEmail(firstName, lastName);
    } else {
      uniqEmails.push(email);
      return email;
    }
  };

  return Array.from({length: count}, () => {
    const gender = faker.name.gender();
    const title = faker.name.prefix(gender);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName();
    const email = generateEmail(firstName, lastName);
    const dob = faker.date.past(faker.random.number({ min: 16, max: 90 }));
    const address = faker.address.streetAddress();
    const postcode = faker.address.zipCode();
    const telephone = faker.phone.phoneNumber();

    const establishmentId = faker.random.arrayElement(establishmentIds);
    const role = faker.random.arrayElement(roles);

    return {
      id: uuid(),
      title,
      firstName,
      lastName,
      email,
      dob,
      address,
      postcode,
      telephone,
      permissions: [ { establishmentId, role } ]
    };
  });
};
