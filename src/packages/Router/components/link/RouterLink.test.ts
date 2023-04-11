/* eslint-disable no-new */
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import assert from 'node:assert';
import type { RouterLinkType } from '.';

const goStub = sinon.stub();
const backStub = sinon.stub();

const { default: RouterLink } = proxyquire('./index.ts', {
	'../../Router': {
		default: class {
			go = goStub;
			back = backStub;
		}
	}
}) as { default: RouterLinkType };

describe('test RouterLink component', () => {
	const label = 'test page';
	const href = '/test-page';

	beforeEach(() => {
		goStub.reset();
		backStub.reset();
	});

	it('should render', () => {
		new RouterLink({
			children: label,
			href
		});
	});

	it('should one call Router.go on lick click', () => {
		const linkInstance = new RouterLink({
			children: label,
			href
		});

		(linkInstance.element?.firstElementChild as HTMLElement)?.click();

		assert.strictEqual(goStub.calledOnce, true);
	});

	it('should call Router.go with pointed href', () => {
		const linkInstance = new RouterLink({
			children: label,
			href
		});

		(linkInstance.element?.firstElementChild as HTMLElement)?.click();

		assert.strictEqual(goStub.calledOnceWith(href), true);
	});

	it('should call Router.back if component create with type equal back argument', () => {
		const linkInstance = new RouterLink({
			children: label,
			href,
			type: 'back'
		});

		(linkInstance.element?.firstElementChild as HTMLElement)?.click();

		assert.strictEqual(goStub.called, false);
		assert.strictEqual(backStub.calledOnce, true);
	});
});
