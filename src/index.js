import tasker from './tasker';
import Router from './router';

const hotReload = () => {
  const environment = tasker.global('TJS_ENV');

  if (environment !== 'development') return Promise.resolve();

  return fetch(tasker.global('TJS_DEV_REMOTE'))
    .then(res => res.text())
    .then((result) => {
      const existingFile = tasker.readFile(tasker.global('TJS_LOCAL_PATH'));

      if (existingFile !== result) {
        tasker.writeFile(tasker.global('TJS_LOCAL_PATH'), result);
        tasker.flash('script updated');
        tasker.performTask('TJS:RunScript', window.priority, window.local_keys);
        tasker.exit();
      }

    })
    .catch(err => tasker.flash(err.message));
};

export default class TaskerJS {
  constructor(routes) {
    this.router = new Router(routes, tasker);

    hotReload()
      .then(() =>
        this.router.dispatch(tasker.locals)
          .catch(err => tasker.flash(err.message))
          .then(() => tasker.exit())
      );
  }
}
