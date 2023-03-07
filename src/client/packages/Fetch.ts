/* eslint-disable class-methods-use-this */
enum METHOD {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data: Record<any, any>) {
	const queryStr = Object.entries(data)
		.map((item) => item.join('='))
		.join('&');

	return queryStr ? `?${queryStr}` : '';
}

type OptionsType = {
	data?: Record<string, unknown> | FormData;
	timeout?: number;
	headers?: Record<string, string>;
	method?: METHOD;
};

const { BASE_PATH } = process.env;

const defaultHeaders = {
	'Content-type': 'application/json; charset=utf-8'
} as const;

class HTTPTransport {
	readonly basePath: string;
	constructor(pathPrefix: string) {
		this.basePath = BASE_PATH + pathPrefix;
	}

	get = <T>(url: string, options: OptionsType = {}) => {
		const { data = {} } = options;
		return this.request(
			this.basePath + url + queryStringify(data),
			{ ...options, method: METHOD.GET },
			options.timeout
		) as Promise<IResponse<T>>;
	};

	put = <T>(url: string, options: OptionsType = {}) => (
		this.request(
			this.basePath + url,
			{
				...options,
				method: METHOD.PUT
			},
			options.timeout
		) as Promise<IResponse<T>>
	);

	post = <T>(url: string, options: OptionsType = {}) => (
		this.request(
			this.basePath + url,
			{ ...options, method: METHOD.POST },
			options.timeout
		) as Promise<IResponse<T>>
	);

	delete = <T>(url: string, options: OptionsType = {}) => (
		this.request(
			this.basePath + url,
			{
				...options,
				method: METHOD.DELETE
			},
			options.timeout
		) as Promise<IResponse<T>>
	);

	request = (url: string, options: OptionsType, timeout = 5000) => {
		const { headers = defaultHeaders, data, method = METHOD.GET } = options;

		const isFormData = data instanceof FormData;

		// eslint-disable-next-line curly
		if (isFormData) {
			headers['Content-type'] = 'multipart/form-data';
		}

		const rawData = isFormData ? data : JSON.stringify(data);

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.withCredentials = true;

			xhr.open(method, url);

			xhr.timeout = timeout;

			Object.keys(headers).forEach((name) => {
				const value = headers[name];
				xhr.setRequestHeader(name, value);
			});

			xhr.onload = function () {
				resolve(JSON.parse(xhr.response));
			};

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			if (method === METHOD.GET || !data) xhr.send();
			else xhr.send(rawData);
		});
	};
}

export default HTTPTransport;
