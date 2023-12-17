const applyErrors = require('./applyErrors');
const { generateName, generateAddress, generatePhone } = require('./faker');

const ERR_CONVERT = 1000;

const generateUser = (faker, locale) => {
  const name = generateName(faker);
  const address = generateAddress(faker);
  const phone = generatePhone(faker, locale);

  return { ...name, ...address, phone };
};

const generateErrorUser = async (faker, locale) => {
  try {
    const user = generateUser(faker, locale);
    return applyErrors(faker, user);
  } catch (error) {
    console.error(' user:', error);
  }
};

const generateNoErrorUser = (faker, locale) => {
  const identifier = faker.string.uuid();
  const user = generateUser(faker, locale);
  return { identifier, ...user };
};

const generateErrorUsers = async (faker, totalErrors, locale) => {
  try {
    const errorPromises = new Array(totalErrors).fill().map(() => generateErrorUser(faker, locale));
    const errorResults = await Promise.all(errorPromises);

    return errorResults.map((result) => {
      const identifier = faker.string.uuid();
      return { identifier, ...result };
    });
  } catch (error) {
    console.error('Error generating error users:', error);
  }
};

const generateUsers = async (faker, batchSize, totalErr, locale) => {
  const users = [];

  try {
    const errorUsers = await generateErrorUsers(faker, totalErr, locale);
    users.push(...errorUsers);

    const remainingBatchSize = batchSize - totalErr;
    const noErrorUsers = new Array(
      remainingBatchSize,
    ).fill().map(() => generateNoErrorUser(faker, locale));
    users.push(...noErrorUsers);

    return users;
  } catch (error) {
    console.error('Error generating users:', error);
  }
};

const generateUniqueUsers = async (
  faker, errorRate, batchSize, totalErr, locale,uniqueUsers = new Map()
) => {
  try {
    if (uniqueUsers.size >= batchSize) {
      return Array.from(uniqueUsers.values());
    }

    const users = await generateUsers(faker, batchSize, totalErr, locale);

    // Check uniqueness based on identifier using filter
    users.forEach((user) => {
      const { identifier } = user;

      const isUnique = !uniqueUsers.has(identifier);

      if (isUnique) {
        uniqueUsers.set(identifier, user);
      }
    });

    // Recursively call the function to continue generating until batchSize is reached
    return generateUniqueUsers(faker, errorRate, batchSize, totalErr, locale,uniqueUsers);
  } catch (error) {
    console.error('Error generating unique users:', error);
  }
};

const generateDataByBatch = async (faker, errorRate, batchSize, locale) => {
  try {
    const totalErr = Math.floor((errorRate / ERR_CONVERT) * batchSize);
    return generateUniqueUsers(faker, errorRate, batchSize, totalErr, locale);
  } catch (error) {
    console.error('Error generating data by batch:', error);
  }
};

const sendResponse = (res, status, message, data = null) => res.status(status).json({
  status,
  message,
  data,
});

module.exports = {
  generateDataByBatch,
  sendResponse,
};
