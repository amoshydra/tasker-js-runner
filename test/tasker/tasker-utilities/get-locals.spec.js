import test from 'ava';
import { taskerUtilities } from '../../../src/tasker';

class Context {
  constructor(context) {
    Object.keys(context).forEach(key => this[key] = context[key]);
  }

  local(name) {
    return this[name];
  }
}

test('should output a minimal locals containing caller and par', t => {
  const actual = taskerUtilities.getLocals(
    new Context({})
  );

  t.deepEqual(actual, {
    caller: [],
    par: [],
  })
});

test('should merge own locals with parent\'s locals', t => {
  const parentLocal = JSON.stringify({
    localA: 'localA',
    localB: 'localB',
    conflictA: 'parentConflicA',
  });
  const actual = taskerUtilities.getLocals(
    new Context({
      caller: ['caller3', 'caller2', 'caller1'],
      par: [
        {
          localA: 'localA',
          localB: 'localB',
          conflictA: 'parentConflicA',
        },
      ],
      conflictA: 'selfConflicA',
    })
  );

  t.deepEqual(actual, {
    caller: ['caller3', 'caller2', 'caller1'],
    par: [
      JSON.parse(parentLocal),
    ],
    localA: 'localA',
    localB: 'localB',
    conflictA: 'parentConflicA',
  })
});

test('should skip parent\'s locals if it is null', t => {
  const parentLocal = null;
  const actual = taskerUtilities.getLocals(
    new Context({
      caller: ['caller3', 'caller2', 'caller1'],
      par: [
        parentLocal,
      ],
    })
  );

  t.deepEqual(actual, {
    caller: ['caller3', 'caller2', 'caller1'],
    par: [
      null,
    ],
  })
});

test('should skip parent\'s locals if it is not an JSON string', t => {
  const parentLocal = "INVALID: PARENT";
  const actual = taskerUtilities.getLocals(
    new Context({
      caller: ['caller3', 'caller2', 'caller1'],
      par: [
        parentLocal,
      ],
    })
  );

  t.deepEqual(actual, {
    caller: ['caller3', 'caller2', 'caller1'],
    par: [
      parentLocal,
    ],
  })
});

test('should ignore own locals with par2 is provided', t => {
  const overridingLocal = JSON.stringify({
    caller: [
      'OverridingCaller2',
      'OverridingCaller1'
    ],
  });
  const actual = taskerUtilities.getLocals(
    new Context({
      caller: ['caller3', 'caller2', 'caller1'],
      par: [
        'null',
        overridingLocal,
      ],
    })
  );

  t.deepEqual(actual, {
    caller: [
      'OverridingCaller2',
      'OverridingCaller1'
    ],
    par: [],
  })
});
