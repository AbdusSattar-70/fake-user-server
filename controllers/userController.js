const convertQueryToNum = require('../utils/convertQueryToNum');
const { generateDataByBatch, sendResponse } = require('../utils/generateUsers');
const { switchFakerLocale, attachSeed } = require('../utils/faker');
const ERR_LIMIT = 1000;
const userController = async (req, res) => {
  if (!req.query) return sendResponse(res, 400, 'Not found');
  try {
    const {
      errorRate, region, seed, batch,
    } = req.query;
    const errRate = convertQueryToNum(errorRate);
    const seedVal = convertQueryToNum(seed);
    const batchVal = convertQueryToNum(batch);
    const faker = switchFakerLocale(region);
    attachSeed(faker, seedVal);

    const Err = errRate > ERR_LIMIT ? ERR_LIMIT : errRate

    const users = await generateDataByBatch(faker, Err, batchVal, region);
    sendResponse(res, 200, 'success', users);
  } catch (error) {
    sendResponse(res, 500, 'Internal Server Error');
  }
};

module.exports = userController;
