const memoize = (fn) => {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(fn(...args));
    if (key in cache) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};

module.exports = memoize;