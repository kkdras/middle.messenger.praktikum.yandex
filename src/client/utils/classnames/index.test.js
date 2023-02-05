/* eslint-disable import/no-unresolved */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { classNames } from './index.js';

describe('test classNames', () => {
	it('case 1', () => {
		assert.strictEqual(classNames('foo', 'bar'), 'foo bar');
	});

	it('case 2', () => {
		assert.strictEqual(classNames('foo', { bar: true }), 'foo bar');
	});

	it('case 3', () => {
		assert.strictEqual(classNames({ 'foo-bar': true }), 'foo-bar');
	});

	it('case 4', () => {
		assert.strictEqual(classNames({ 'foo-bar': false }), '');
	});

	it('case 5', () => {
		assert.strictEqual(classNames({ foo: true }, { bar: true }), 'foo bar');
	});

	it('case 6', () => {
		assert.strictEqual(classNames({ foo: true, bar: true }), 'foo bar');
	});

	it('case 7', () => {
		assert.strictEqual(classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }), 'foo bar baz quux');
	});

	it('case 8', () => {
		assert.strictEqual(classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''), 'bar 1');
	});

	it('case 9', () => {
		assert.strictEqual(classNames('a', ['b', { c: true, d: false }]), 'a b c');
	});
});
