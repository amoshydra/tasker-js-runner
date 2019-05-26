export const ROUTE_TYPE = {
  Enter: 'enter',
  Exit: 'exit',
};

export const parseCallerId = (callerId = '') => {
  const [callerSourceId, routeId] = callerId.split('=', 2);

  switch (callerSourceId) {
    case 'profile': {
      const [callerType, callerRoute] = routeId.split(':', 2);
      return {
        type: callerType,
        route: callerRoute,
      };
    }
    case 'task': return {
      type: ROUTE_TYPE.Enter,
      route: routeId,
    };
    default: return {
      type: ROUTE_TYPE.Enter,
      route: callerId,
    };
  }
}

export default class Router {
  constructor(routes, context) {
    this.context = context;
    this.routes = routes;
    if (!this.routes._errorHandler) {
      this.routes._errorHandler = {
        enter() {
          context.console.log('No route matched')
        },
        exit() {},
      };
    }
  }

  dispatch(locals) {
    return Promise.resolve()
      .then(() => {
        // Make route
        const callerId = locals.caller && locals.caller[locals.caller.length - 1];
        const caller = parseCallerId(callerId);

        // Go to route
        const route = this.routes[caller.route] || this.routes._errorHandler;
        return route[caller.type](locals, this.context);
      });
  }
}
