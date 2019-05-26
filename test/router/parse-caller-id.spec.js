import test from 'ava';
import {
  parseCallerId,
  ROUTE_TYPE,
} from '../../src/router';

test('should parse Profile enter syntax', t => {
  const caller = parseCallerId('profile=enter:ProfileName');

  t.deepEqual(caller, {
    type: ROUTE_TYPE.Enter,
    route: 'ProfileName'
  });
});

test('should parse Profile exit syntax', t => {
  const caller = parseCallerId('profile=exit:ProfileName');

  t.deepEqual(caller, {
    type: ROUTE_TYPE.Exit,
    route: 'ProfileName'
  });
});

test('should parse Task syntax', t => {
  const caller = parseCallerId('task=TaskName');

  t.deepEqual(caller, {
    type: ROUTE_TYPE.Enter,
    route: 'TaskName'
  });
});

test('should parse UI syntax', t => {
  const caller = parseCallerId('ui');

  t.deepEqual(caller, {
    type: ROUTE_TYPE.Enter,
    route: 'ui'
  });
});

test('should parse arbitary caller syntax', t => {
  t.is(
    parseCallerId('Do something').route,
    'Do something'
  );

  t.is(
    parseCallerId('Light:On').route,
    'Light:On'
  );

  t.is(
    parseCallerId('NoneProfileOrTask=Name').route,
    'NoneProfileOrTask=Name'
  );
  t.is(
    parseCallerId('NoneProfileOrTask=Enter:Name').route,
    'NoneProfileOrTask=Enter:Name'
  );
});
