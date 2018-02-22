/* global flash */

if (typeof flash === 'function') {
  window.console = {
    log(...params) {
      flash(
        params
          .map(param => (typeof param === 'string') ? param : JSON.stringify(param))
          .join(' ')
      );
    },
  };
}
