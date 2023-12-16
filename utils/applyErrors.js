const KEYS = {
  ADD: 'ADD',
  SWAP: 'SWAP',
  DELETE: 'DELETE',
};

const applyError = (obj, faker, errorType) => new Promise((resolve, reject) => {
  try {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const position = Math.floor(Math.random() * value.length);

      if (key.toLowerCase() === 'phonenumber' && key.toLowerCase() === 'zipcode' && errorType === KEYS.ADD) {
        const rand = faker.helpers.rangeToNumber({ min: 10, max: 90 });
        obj[key] = `${value}-${rand}`;
      } else if (errorType === KEYS.DELETE) {
        obj[key] = value.slice(0, position) + value.slice(position + 1);
      } else if (errorType === KEYS.ADD) {
        const randomChar = faker.string.alpha(10);
        obj[key] = value.slice(0, position) + randomChar + value.slice(position);
      } else if (errorType === KEYS.SWAP) {
        obj[key] = value.slice(0, position)
            + value[position + 1]
            + value[position]
            + value.slice(position + 2);
      }
    });

    resolve(obj);
  } catch (error) {
    reject(error);
  }
});

const applyErrors = async (faker, obj) => {
  const errorTypes = [KEYS.ADD, KEYS.DELETE, KEYS.SWAP];
  const err = errorTypes[Math.floor(Math.random() * errorTypes.length)];

  await applyError(obj, faker, err);

  return obj;
};

module.exports = applyErrors;
