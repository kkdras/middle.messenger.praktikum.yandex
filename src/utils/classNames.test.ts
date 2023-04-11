import assert from 'node:assert';
import { classNames } from './classNames';

describe('classNames helper', () => {
	it('should unwrap array', () => {
		const params = ['foo', 'bar'];

		const result = classNames(params);
		const assumeResult = 'foo bar';

		assert.strictEqual(result, assumeResult);
	});

	it('case 2', () => {
		const params = ['foo', { bar: true }];

		const result = classNames(...params);
		const assumeResult = 'foo bar';

		assert.strictEqual(result, assumeResult);
	});

	it('case 3', () => {
		const params = { 'foo-bar': true };

		const result = classNames(params);
		const assumeResult = 'foo-bar';

		assert.strictEqual(result, assumeResult);
	});

	it('case 4', () => {
		const params = { 'foo-bar': false };

		const result = classNames(params);
		const assumeResult = '';

		assert.strictEqual(result, assumeResult);
	});

	it('case 5', () => {
		const params = [{ foo: true }, { bar: true }];

		const result = classNames(params);
		const assumeResult = 'foo bar';

		assert.strictEqual(result, assumeResult);
	});

	it('case 6', () => {
		const param = { foo: true, bar: true };

		const result = classNames(param);
		const assumeResult = 'foo bar';

		assert.strictEqual(result, assumeResult);
	});

	it('case 7', () => {
		const params = ['foo', { bar: true, duck: false }, 'baz', { quux: true }];

		const result = classNames(params);
		const assumeResult = 'foo bar baz quux';

		assert.strictEqual(result, assumeResult);
	});

	it('case 8', () => {
		const params = [
			null,
			false,
			'bar',
			undefined,
			0,
			1,
			{ baz: null },
			''
		] as Parameters<typeof classNames>;

		const result = classNames(params);
		const assumeResult = 'bar 1';

		assert.strictEqual(result, assumeResult);
	});

	it('case 9', () => {
		const params = ['a', ['b', { c: true, d: false }]];

		const result = classNames(params);
		const assumeResult = 'a b c';

		assert.strictEqual(result, assumeResult);
	});
});
