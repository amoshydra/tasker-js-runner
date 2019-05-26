import { initializeTaskerJs } from './tasker';
import Router from './router';

window.tasker = initializeTaskerJs(window);

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
          /* Task name */ TASK.RunScript,
          /* Priority */tasker.local('priority'),
          /* par1 */ 'null',
          /* par2 */ JSON.stringify(tasker.locals), // Supply par2 to overwrite context
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
