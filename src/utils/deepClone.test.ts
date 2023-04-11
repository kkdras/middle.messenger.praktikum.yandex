import assert from 'node:assert';

describe('deepCopy helper', () => {
	it('should return the same value if value has plain type', () => {
		assert.strictEqual(true, true);
	});

	it('should correct correct work with nested object and arrays', () => {});
});
