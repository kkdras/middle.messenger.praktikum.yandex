import assert from 'node:assert';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import type { BlockType as BlockConstructorType } from './Block';

const { Block } = proxyquire('./Block.ts', {}) as { Block: BlockConstructorType };
type BlockType = InstanceType<BlockConstructorType>;

describe('test block class', () => {
	const buttonValue = 'click';
	const HTML = `<button>${buttonValue}</button>`;

	const componentWillUnmountMock = sinon.stub();
	const propsUpdatedMock = sinon.stub();
	const eventHandlerMock = sinon.stub();
	const storePropsUpdatedMock = sinon.stub();
	const componentDidMountMock = sinon.stub();

	const baseProps = { test: 'value' };

	let TestBlockConstructor = null as unknown as new ()=> BlockType;

	let testBlockInstance = null as null | BlockType;

	before(() => {
		class NestedTestBlock extends Block {
			constructor() {
				super('div', {
					events: {
						click: eventHandlerMock
					},
					listenOnChildOfTreePosition: 1
				});
			}

			override render(): DocumentFragment {
				return Block.compile(HTML, this.props);
			}

			override componentWillUnmount = componentWillUnmountMock;
			override propsUpdated = propsUpdatedMock;
			override storePropsUpdated = storePropsUpdatedMock;
			override componentDidMount = componentDidMountMock;
		}

		const nestedBLockInstance = new NestedTestBlock();

		class TestBlock extends Block {
			constructor(props: Record<string, string> = {}) {
				super('div', {
					children: nestedBLockInstance,
					...props
				});
			}
			override render(): DocumentFragment {
				return Block.compile('{{{children}}}', this.props);
			}

			override componentWillUnmount = componentWillUnmountMock;
			override propsUpdated = propsUpdatedMock;
			override storePropsUpdated = storePropsUpdatedMock;
			override componentDidMount = componentDidMountMock;
		}

		TestBlockConstructor = TestBlock;
	});

	beforeEach(() => {
		componentWillUnmountMock.reset();
		propsUpdatedMock.reset();
		eventHandlerMock.reset();
		storePropsUpdatedMock.reset();
		componentDidMountMock.reset();
	});

	it('should render', () => {
		testBlockInstance = new TestBlockConstructor();
	});

	it('should return element', () => {
		testBlockInstance = new TestBlockConstructor();

		const result = testBlockInstance!.getContent();

		assert.strictEqual(!!result, true);
	});

	it('should call eventHandler', () => {
		testBlockInstance = new TestBlockConstructor();

		const buttonElement = testBlockInstance!.element?.firstElementChild
			?.firstElementChild as HTMLElement;

		buttonElement.click();

		assert.strictEqual(eventHandlerMock.calledOnce, true);
	});

	it('should call all defined componentDidMount methods', () => {
		testBlockInstance = new TestBlockConstructor();

		testBlockInstance?.dispatchComponentDidMount();

		assert.strictEqual(componentDidMountMock.callCount, 2);
	});

	it('should throw error if new props doesnt exist', () => {
		testBlockInstance = new TestBlockConstructor();

		const act = () => testBlockInstance!.setProps(baseProps);

		assert.throws(act);
	});

	it('should return string component placeholder with id', () => {
		testBlockInstance = new TestBlockConstructor();

		const id = testBlockInstance!.id;
		const stringBlock = testBlockInstance.toString();

		assert.strictEqual(typeof stringBlock === 'string', true);
		assert.match(stringBlock, new RegExp(id));
	});

	it('should change block style', () => {
		testBlockInstance = new TestBlockConstructor();

		testBlockInstance.hide();

		const result = window.getComputedStyle(
			testBlockInstance!.element as HTMLElement
		).display;

		assert.strictEqual(result, 'none');
	});
});
