import assert from 'node:assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { Block } from '../Block';
import { RouterType } from './Router';

const renderStub = sinon.stub();

const { default: Router } = proxyquire('./Router.ts', {
	'./Route.ts': {
		default: class {
			hide() {}
			render = renderStub;
			leave() {}
			getContent() {
				return {};
			}
		}
	}
}) as { default: RouterType };

describe('test Router class', () => {
	const origHistory = global.history;
	before(() => {
		global.history = {
			pushState: goStub,
			back: backStub,
			replaceState: replaceStub
		} as unknown as History;

		router = new Router();
		router.use(path, getComponentInstance);
		router.use(path2, getComponentInstance);
		router.start();
	});

	after(() => {
		global.history = origHistory;
	});

	let router = null as unknown as InstanceType<RouterType>;
	const path = '/test';
	const path2 = '/test2';
	const getComponentInstance = () => ({} as Block);

	const goStub = sinon.stub();
	const backStub = sinon.stub();
	const replaceStub = sinon.stub();

	beforeEach(() => {
		goStub.reset();
		backStub.reset();
		replaceStub.reset();
		renderStub.reset();
	});

	it('should call history go method', () => {
		router.go('/some');

		assert.strictEqual(goStub.calledOnce, true);
	});

	it('should call history back method', () => {
		router.back();

		assert.strictEqual(backStub.calledOnce, true);
	});

	it('should call render method on go with registered path', () => {
		router.go(path2);

		assert.strictEqual(renderStub.calledOnce, true);
	});

	it('should call history replace if if go called with "withReplace" argument', () => {
		const withReplace = true;
		router.go(path, withReplace);

		assert.strictEqual(replaceStub.calledOnce, true);
	});

	it('should emit event if popstate event fires', () => {
		const callback = sinon.stub();

		router.on(Router.Events.PATH_CHANGE, callback);

		router.go(path);

		assert.strictEqual(callback.calledOnce, true);
	});
});
