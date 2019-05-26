export const ROUTE_TYPE = {
  Enter: 'enter',
  Exit: 'exit',
};

export const parseCallerId = (callerId) => {
  const i = callerId.indexOf(':');
  return {
    type: callerId.slice(0, i).split('=')[1] || ROUTE_TYPE.Enter,
    route: callerId.slice(i + 1),
  };
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
