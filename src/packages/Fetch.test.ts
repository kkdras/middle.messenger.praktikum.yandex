import assert from 'node:assert';
import sinon from 'sinon';
import { HTTPTransport, METHODS } from './Fetch';

describe('test HTTPTransport', () => {
	let requests: sinon.SinonFakeXMLHttpRequest[] = [];
	const originalXHR = global.XMLHttpRequest;
	const path = '/test';
	const prefix = '/prefix';
	const fetcher = new HTTPTransport(prefix);
	const body = {
		key: 'value'
	} as const;

	before(() => {
		const XHR = sinon.useFakeXMLHttpRequest();

		// @ts-ignore
		global.XMLHttpRequest = XHR;
		XHR.onCreate = (xhr) => {
			requests.push(xhr);
		};
	});

	after(() => {
		global.XMLHttpRequest = originalXHR;
	});

	beforeEach(() => {
		requests = [];
	});

	it('should use specified prefix in request url', () => {
		fetcher.get(path);

		assert.match(requests[0].url, new RegExp(prefix));
	});

	it('should set headers', () => {
		const headerKey = 'x-client-header';
		const headerValue = '1';

		const headers = {
			[headerKey]: headerValue
		};

		fetcher.get(path, {
			headers
		});

		assert.strictEqual(requests[0].requestHeaders[headerKey], headerValue);
	});

	it('should call xhr with specified method', () => {
		fetcher.get(path);
		fetcher.post(path);
		fetcher.put(path);
		fetcher.delete(path);

		assert.strictEqual(requests[0].method, METHODS.GET);
		assert.strictEqual(requests[1].method, METHODS.POST);
		assert.strictEqual(requests[2].method, METHODS.PUT);
		assert.strictEqual(requests[3].method, METHODS.DELETE);
	});

	it('should use options parseResult', async () => {
		const assumeResponseWithoutData: IResponse<null> = {
			json: null,
			status: 200
		};
		const assumeResponseWithData: IResponse<typeof body> = {
			json: body,
			status: 200
		};

		const promiseWithoutResult = fetcher.get(path, {
			parseResult: false
		});

		const promiseWithResult = fetcher.get(path, {
			parseResult: true
		});

		requests[0].respond(200, {}, JSON.stringify(body));
		requests[1].respond(200, {}, JSON.stringify(body));

		const responseWithoutData = await promiseWithoutResult;
		const responseWithData = await promiseWithResult;

		assert.deepStrictEqual(responseWithoutData, assumeResponseWithoutData);
		assert.deepStrictEqual(responseWithData, assumeResponseWithData);
	});

	describe('test GET method', () => {
		it('should pass body as query string', () => {
			fetcher.get(path, {
				data: body
			});

			assert.match(requests[0].url, /\\?key=value/);
		});
	});

	describe('test POST method', () => {
		it('should delete Content-type header if data is FormData', () => {
			const data = new FormData();
			const assumeResult = {};

			fetcher.post(path, { data });

			assert.deepStrictEqual(requests[0].requestHeaders, assumeResult);
		});

		it('should pass to the request the same data', () => {
			fetcher.post(path, {
				data: body
			});

			assert.deepStrictEqual(JSON.parse(requests[0].requestBody), body);
		});
	});
});
