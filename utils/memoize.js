const memoize = (fn) => {
  const cache = new Map();

  return async (...args) => {
    const key = args.map(arg => (typeof arg === 'object' ? arg.constructor.name : arg)).join('|');

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

module.exports = memoize;
