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
	parseResult?: boolean;
};

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

const { BASE_PATH } = process.env;

export class HTTPTransport {
	readonly basePath: string;
	constructor(pathPrefix: string) {
		this.basePath = BASE_PATH + pathPrefix;
	}

	async get<T = unknown>(url: string, options: OptionsType = {}) {
		const { data = {} } = options;
		return this.request<T>(
			this.basePath + url + queryStringify(data),
			{ ...options, method: METHOD.GET },
			options.timeout
		);
	}

	async put<T = unknown>(url: string, options: OptionsType = {}) {
		return this.request<T>(
			this.basePath + url,
			{
				...options,
				method: METHOD.PUT
			},
			options.timeout
		);
	}

	async post<T = unknown>(url: string, options: OptionsType = {}) {
		return this.request<T>(
			this.basePath + url,
			{ ...options, method: METHOD.POST },
			options.timeout
		);
	}

	async delete<T = unknown>(url: string, options: OptionsType = {}) {
		return this.request<T>(
			this.basePath + url,
			{
				...options,
				method: METHOD.DELETE
			},
			options.timeout
		);
	}

	async request<T>(url: string, options: OptionsType, timeout = 5000) {
		const {
			headers = {
				'Content-type': 'application/json; charset=utf-8'
			} as Writeable<
			NonNullable<OptionsType['headers']>
			>,
			data,
			method = METHOD.GET,
			parseResult = true
		} = options;

		const isFormData = (data
			&& typeof data === 'object'
			&& Object.getPrototypeOf(data) === FormData.prototype);

		if (isFormData) {
			delete headers['Content-type'];
		}

		const rawData = isFormData ? (data as FormData) : JSON.stringify(data);

		return new Promise<IResponse<T>>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.withCredentials = true;

			xhr.open(method, url);

			xhr.timeout = timeout;

			Object.keys(headers).forEach((name) => {
				const value = headers[name];
				xhr.setRequestHeader(name, value);
			});

			const handleError = () => {
				// eslint-disable-next-line prefer-promise-reject-errors
				reject({
					json: null,
					status: xhr.status
				});
			};

			xhr.onload = () => {
				if (xhr.status !== 200) handleError();
				resolve({
					json: parseResult ? JSON.parse(xhr.response) : null,
					status: xhr.status
				});
			};

			xhr.onabort = handleError;
			xhr.onerror = handleError;
			xhr.ontimeout = handleError;

			if (method === METHOD.GET || !data) xhr.send();
			else xhr.send(rawData);
		});
	}
}
