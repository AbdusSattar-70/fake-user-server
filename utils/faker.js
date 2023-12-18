const { allFakers, faker } = require('@faker-js/faker');
const seedrandom = require('seedrandom');
const memoize = require('./memoize');
const generateLookupTable = require('./lookupTable');

const phoneStructures = {
  de: '+49 123 4567890',
  de_AT: '+43 1234 567890',
  de_CH: '+41 12 3456789',
  en: '+44 1234 567890',
  en_AU: '+61 2 1234 5678',
  en_CA: '+1 123 456 7890',
  en_IE: '+353 1 123 4567',
  en_IN: '+91 12345 67890',
  en_US: '+1 123 456 7890',
  zh_CN: '+86 13512345678',
};

const generateLookupMemo = memoize(generateLookupTable);

const generateName = (faker) => {
  const names = generateLookupMemo(faker.person.firstName);
  const middleNames = generateLookupMemo(faker.person.middleName);
  const lastNames = generateLookupMemo(faker.person.lastName);
  const firstName = faker.helpers.arrayElement(names);
  const middleName = faker.helpers.arrayElement(middleNames);
  const lastName = faker.helpers.arrayElement(lastNames);
  return { firstName, middleName, lastName };
};

const generateAddress = (faker) => {
  const cities = generateLookupMemo(faker.location.city);
  const streets = generateLookupMemo(faker.location.streetAddress);
  const countries = generateLookupMemo(faker.location.country);
  const zipCodes = generateLookupMemo(faker.location.zipCode);
  const city = faker.helpers.arrayElement(cities);
  const street = faker.helpers.arrayElement(streets);
  const country = faker.helpers.arrayElement(countries);
  const zipCode = faker.helpers.arrayElement(zipCodes);
  return {
    city, street, country, zipCode,
  };
};

const generatePhone = (faker, locale) => {
  const phoneStructure = phoneStructures[locale];

  const generatedPN = phoneStructure.replace(/\d/g, () => faker.number.int(9));

  return generatedPN;
};

const switchFakerLocale = (region) => allFakers[region] || faker;

// const attachSeed = (faker, seed) => faker.seed(Math.abs(seedrandom(seed).int32()));
const attachSeed = (faker, seed) => faker.seed(seed);

module.exports = {
  switchFakerLocale,
  attachSeed,
  generateAddress,
  generateName,
  generatePhone,
};