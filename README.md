# Tasker JS Runner
- Write Tasker task as Javascript module
- Map profile name to module
- Auto refresh script during development mode

# Guide
## Installation
with npm
```
npm install tasker-js-runner --save
```

with yarn
```
yarn add tasker-js-runner
```
### Usage

#### Defining profile map `index.js`
```javascript
import TaskerJs from 'tasker-js-runner';

// Tasker Javascript modules
import notification from './modules/notification';

// Construct Tasker JS and pass in mapping information as an Object
new TaskerJs({
  // Profile name: module
  'Notification:All': notification,
});

```

#### Defining a module `modules/notification`
A module should contain an `enter` and an `exit` function.  
The 2 functions will receive all the local variables from the profile's task
via `locals` and a reference Tasker's global object via `tasker`.

```javascript
export default {
  enter(locals, tasker) {
    // Example: Accessing local variables %anapp and %antitle from AutoNotification
    const content = locals.anapp + ' ' + locals.antitle;

    // Tasker's function can be accessed via the `tasker` object.
    tasker.setClip(content);

    // If you wish, you can also omit `tasker` by calling Tasker's function directly.
    // Behind the scene, `tasker` is mapped to the `window` object where the
    // Tasker's function live.
    flash('content');
  },

  exit(locals, tasker) {}
};
```

#### Asynchronous Execution

All module functions are wrapped inside a Promise, which will gracefully exit at the end of execution.  
To ensure proper task exiting while running asynchronous code, always return a promise.
```javascript
export default {
  enter(locals, tasker) {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (tasker.global('BLUE') === 'on') {
          resolve();
        } else {
          reject();
        }
      }, 1000);
    });

  },
  ...
}
```

Otherwise, you can also permaturely terminte the script. This will immediately stop the script from executing.
```javascript
export default {
  enter(locals, tasker) {

    setTimeout(() => {
      tasker.exit()
    }, 1000);

  },
  ...
}
```

## Sample project
https://github.com/amoshydra/tasker-js-runner-project

## Setup on Tasker

### Installing
1. Import the 3 tasks from the [`tasker-imports` folder](https://github.com/amoshydra/tasker-js-runner/tree/master/tasker-imports) into Tasker
    - `TJS_Development_Toggle.tsk.xml`
    - `TJS_RunScript.tsk.xml`
    - `TJS_UpdateScript.tsk.xml`
2. Run [TJS_Development_Toggle] inside Tasker to set up the required global variables
  When [TJS_Development_Toggle] is run for the first time, it will set up all the necessary Global variables for Tasker-JS to run.
    - `%TJS_ENV` - Control the environment Tasker-JS-Runner to run `development`/`production`.
    - `%TJS_DEV_REMOTE` - The remote address where the your project script (a seperate project that make use of this library) will be downloaded. You will need to change the value of this variable in this task to match the IP of your project.
    - `%TJS_LOCAL_PATH` - The location where the project script will be saved (default to `Documents/tasker-js-runner.js`)

### Using
1. Create a Tasker named profile (i.e. `Notification:All`) and select `TJS:RunScript` as its task.
2. Tasker-JS-Runner will detect the profile name and look execute the Javascipt module that's mapped into `Notification:All` in the Profile Map (see example from [above](#defining-profile-map-indexjs)
