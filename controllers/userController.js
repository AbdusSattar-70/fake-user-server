/* eslint-disable consistent-return */
const BATCH_LIMIT = 20;
const convertQueryToNum = require('../utils/convertQueryToNum');
const { generateDataByBatch, sendResponse } = require('../utils/generateUsers');
const { switchFakerLocale, attachSeed } = require('../utils/faker');

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
    const batchSize = batchVal > BATCH_LIMIT ? BATCH_LIMIT : batchVal;
    attachSeed(faker, seedVal);

    const users = await generateDataByBatch(faker, errRate, batchSize, region);
    sendResponse(res, 200, 'success', users);
  } catch (error) {
    sendResponse(res, 500, 'Internal Server Error');
  }
};

module.exports = userController;
