const LOOKUP_DATA_AMOUNT = 500;
const generateLookupTable = (fakeDataGenerator) => {
  if (typeof fakeDataGenerator !== 'function') {
    return [];
  }

  const data = new Array(LOOKUP_DATA_AMOUNT)
    .fill(LOOKUP_DATA_AMOUNT)
    .map(() => fakeDataGenerator());
  return data;
};

module.exports = generateLookupTable;