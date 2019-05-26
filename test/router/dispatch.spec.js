import test from 'ava';
import sinon from 'sinon';
import Router from '../../src/router';

test('should dispatch routes.ui.enter function given no caller', async t => {
  const context = {};
  const router = new Router({}, context);

  const defaultUiEnterSpy = sinon.spy(router.routes.ui, 'enter');

  const locals = { /* locals without caller */ };
  await router.dispatch(locals);

  t.true(defaultUiEnterSpy.calledOnceWithExactly(locals, context));
});

test('should dispatch routes.ui.enter function given invalid caller', async t => {
  const context = {};
  const router = new Router({}, context);

  const defaultUiEnterSpy = sinon.spy(router.routes.ui, 'enter');

  const locals = {
    caller: ['profile=enter:AnInvalidCallerId']
  };
  await router.dispatch(locals);

  t.true(defaultUiEnterSpy.calledOnceWithExactly(locals, context));
});

test('should dispatch matching Profile enter caller', async t => {
  const context = {};
  const router = new Router({
    ValidCallerId: {
      enter: sinon.fake(),
    }
  }, context);

  const locals = {
    caller: ['profile=enter:ValidCallerId']
  };
  await router.dispatch(locals);

  t.true(router.routes.ValidCallerId.enter.calledOnceWithExactly(locals, context));
});

test('should dispatch matching Profile exit caller', async t => {
  const context = {};
  const router = new Router({
    ValidCallerId: {
      exit: sinon.fake(),
    }
  }, context);

  const locals = {
    caller: ['profile=exit:ValidCallerId']
  };
  await router.dispatch(locals);

  t.true(router.routes.ValidCallerId.exit.calledOnceWithExactly(locals, context));
});

test('should dispatch matching Task caller', async t => {
  const context = {};
  const router = new Router({
    ValidCallerId: {
      enter: sinon.fake(),
    }
  }, context);

  const locals = {
    caller: ['task=ValidCallerId']
  };
  await router.dispatch(locals);

  t.true(router.routes.ValidCallerId.enter.calledOnceWithExactly(locals, context));
});

test('should dispatch matching UI caller', async t => {
  const context = {};
  const router = new Router({
    ui: {
      enter: sinon.fake(),
    }
  }, context);

  const locals = {
    caller: ['ui']
  };
  await router.dispatch(locals);

  t.true(router.routes.ui.enter.calledOnceWithExactly(locals, context));
});

test('should dispatch matching arbitary caller', async t => {
  const context = {};
  const router = new Router({
    'NoneProfileOrTask=Enter:Name': {
      enter: sinon.fake(),
    }
  }, context);

  const locals = {
    caller: ['NoneProfileOrTask=Enter:Name']
  };
  await router.dispatch(locals);

  t.true(router.routes['NoneProfileOrTask=Enter:Name'].enter.calledOnceWithExactly(locals, context));
});
