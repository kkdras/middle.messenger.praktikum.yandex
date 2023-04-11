import assert from 'node:assert';
import { isEqual } from './isEqual';

describe('isEqual helper', () => {
	it('should return true if object is equal', () => {
		const obj1 = { foo: { bar: 'baz' } };
		const obj2 = { foo: { bar: 'baz' } };

		const result = isEqual(obj1, obj2);
		const assumeResult = true;

		assert.strictEqual(result, assumeResult);
	});

	it('should return false because null and {} isDifferent structure', () => {
		const obj1 = { foo: { bar: null } };
		const obj2 = { foo: { bar: {} } };

		const result = isEqual(obj1, obj2);
		const assumeResult = false;

		assert.strictEqual(result, assumeResult);
	});

	it('should return false because one object is subsequence second obj', () => {
		const obj1 = { foo: { bar: 'baz' } };
		const obj2 = { foo: { bar: 'baz' }, zoo: 'quz' };

		const result = isEqual(obj1, obj2);
		const assumeResult = false;

		assert.strictEqual(result, assumeResult);
	});

	it('should return false because defined property with value equal undefined not is undefined property', () => {
		const obj1 = { foo: { bar: undefined } };
		const obj2 = { foo: {} };

		const result = isEqual(obj1, obj2);
		const assumeResult = false;

		assert.strictEqual(result, assumeResult);
	});

	it('should return true if typeof object is subsequence of object and fields is equal', () => {
		const obj1 = { foo: { bar: 'baz' } };
		const obj2 = function () {};

		obj2.foo = { bar: 'baz' };

		const result = isEqual(obj1, obj2);
		const assumeResult = true;

		assert.strictEqual(result, assumeResult);
	});
});
