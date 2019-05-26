export const taskerUtilities = {
  inspect: (target) => {
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
  },

  makeConsole: (context) => ({
    log(...params) {
      context.flash(
        params
          .map(param => (typeof param === 'string') ? param : taskerUtilities.inspect(param))
          .join(' ')
      );
    },
  }),

  getParams: (context) => {
    return (context.par || [])
      .map((rawParam) => {
        // Test if param is a json
        let parsedParam;
        try {
          parsedParam = JSON.parse(rawParam); // will fail if param is not a JSON
        } catch (err) {
          parsedParam = rawParam;
        }
        return parsedParam === 'undefined' ? undefined : parsedParam;
      });
  },

  getLocals: (context) => {
    const taskParameters = taskerUtilities.getParams(context);

    // Handle overriding behaviour
    const par2 = taskParameters[1];
    const overridingLocals = ((par2 && (typeof par2 === 'object')) ? taskParameters[1] : null);
    if (overridingLocals) {
      return {
        par: (overridingLocals.par || []),
        caller: (overridingLocals.caller || []),
        ...overridingLocals,
      };
    }

    // Handle merging behaviour
    const par1 = taskParameters[0];
    const parentLocals = ((par1 && (typeof par1 === 'object')) ? par1 : {}) || {};
    const locals = (context.local_keys || [])
      .reduce((acc, key) => {
        const keyName = key.slice(1);
        acc[keyName] = context.local(keyName);
        return acc;
      }, {});


    return ({
      ...locals,
      ...parentLocals,
      par: taskParameters,
      caller: [
        ...(context.caller || []),
        ...(parentLocals.caller || []),
      ],
    })
  },
};

export const initializeTaskerJs = (context) => {
  // Injecting development functions
  context.inspect = taskerUtilities.inspect;
  context.console = taskerUtilities.makeConsole(context);

  // Attempt to restore param from upstream
  context.locals = taskerUtilities.getLocals(context)

  return context;
}
