/* global local_keys */

var tasker = window;
window.tasker = tasker;

// Injecting development functions
tasker.console = {
  log(...params) {
    tasker.flash(
      params
        .map(param => (typeof param === 'string') ? param : JSON.stringify(param))
        .join(' ')
    );
  },
};

tasker.inspect = (target) => {
  const cache = [];
  return JSON.stringify(target, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
};

tasker.getParams = () => {
  return [
    tasker.local('par1'),
    tasker.local('par2'),
  ]
    .map((rawParam) => {
      // Test if param is a json
      let parsedParam;
      try {
        parsedParam = JSON.parse(rawParam); // will fail if param is not a JSON
      } catch (err) {
        parsedParam = rawParam;
      }
      return parsedParam;
    });
};

tasker.locals = local_keys
  .reduce((acc, key) => {
    const keyName = key.slice(1);
    acc[keyName] = tasker.local(keyName);
    return acc;
  }, {});


export default tasker;
