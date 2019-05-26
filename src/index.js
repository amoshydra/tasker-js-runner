import tasker from './tasker';
import Router from './router';

const CONFIG = {
  Environment: tasker.global('TJS_ENV'),
  RemoteUrl: tasker.global('TJS_DEV_REMOTE'),
  LocalPath: tasker.global('TJS_LOCAL_PATH'),
};
const TASK = {
  RunScript: 'TJS:RunScript',
};

const hotReload = () => {
  if (CONFIG.Environment !== 'development') return Promise.resolve();

  return fetch(CONFIG.RemoteUrl)
    .then(res => res.text())
    .then((result) => {
      const existingFile = tasker.readFile(CONFIG.LocalPath);

      if (existingFile !== result) {
        tasker.writeFile(CONFIG.LocalPath, result);
        tasker.flash('script updated');
        tasker.performTask(
          TASK.RunScript,
          tasker.local('priority'),
          JSON.stringify(tasker.locals)
        );
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
