import assert from 'node:assert';
import { set } from './set';

describe('set helper', () => {
	it('should return original value if param is\'t an object', () => {
		const target = () => {};
		const path = 'foo';
		const value = 'bar';

		const result = set(target as any, path, value);

		assert.strictEqual(result, target);
	});

	it('should return the same object', () => {
		const param = {};

		const result = set(param, 'foo', 'bar');

		assert.strictEqual(result, param);
	});

	it('should set property', () => {
		const obj = {
			foo: {
				bar: 'qux'
			}
		};
		const path = 'foo.bar';
		const value = 'baz';

		const result = set(obj, path, value);
		const assumeResult = { ...obj, foo: { bar: value } };

		assert.deepEqual(result, assumeResult);
	});

	it('should throw error', () => {
		const obj = {};
		const path = '';
		const value = 'foo';

		assert.throws(() => set(obj, path, value));
	});

	it('should create new nested object with property', () => {
		const obj = {
			foo: {
				bar: 'qux'
			}
		};
		const path = 'foo.bar';
		const value = 'baz';

		const result = set(obj, path, value);
		const assumeResult = { ...obj, foo: { bar: value } };

		assert.deepEqual(result, assumeResult);
	});
});
