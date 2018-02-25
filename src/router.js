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
        const callerInfo = locals.callerdebug || locals.caller2 || locals.caller1;
        var i = callerInfo.indexOf(':');
        const caller = {
          type: callerInfo.slice(0, i).split('=')[1] || 'enter',
          route: callerInfo.slice(i + 1),
        };

        // Go to route
        const route = this.routes[caller.route] || this.routes.ui;
        return route[caller.type](locals, this.context);
      });
  }
}
