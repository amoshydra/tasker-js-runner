export const ROUTE_TYPE = {
  Enter: 'enter',
  Exit: 'exit',
};

export const parseCallerId = (callerId = '') => {
  const [callerSourceId, ...splitedRouteId] = callerId.split('=');
  const routeId = splitedRouteId.join('=');

  switch (callerSourceId) {
    case 'profile': {
      const [callerType, ...splittedCallerRoute] = routeId.split(':');
      return {
        type: callerType,
        route: splittedCallerRoute.join(':'),
      };
    }
    case 'ui': return {
      type: ROUTE_TYPE.Enter,
      route: callerSourceId,
    };
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
    if (!this.routes.ui) {
      this.routes.ui = {
        enter() {},
        exit() {},
      };
    }
  }

  dispatch(locals) {
    return Promise.resolve()
      .then(() => {
        // Make route
        const callerId = locals.callerdebug || locals.caller2 || locals.caller1 || '';
        const caller = parseCallerId(callerId);

        // Go to route
        const route = this.routes[caller.route] || this.routes.ui;
        return route[caller.type](locals, this.context);
      });
  }
}
