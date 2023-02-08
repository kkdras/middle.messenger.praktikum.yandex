enum METHOD {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
};

/**
* Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
* На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
* На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
*/
function queryStringify(data: Record<any, any>) {
	const queryStr = Object
		.entries(data)
		.map((item) => item.join('='))
		.join('&');

	return queryStr ? `?${queryStr}` : '';
}

type OptionsType = {
	data?: Record<string, unknown>,
	timeout?: number,
	headers?: Record<string, string>,
	method?: METHOD
}

class HTTPTransport {
	get(url: string, options: OptionsType = {}) {
		const { data = {} } = options;
		return this.request(
			url + queryStringify(data),
			{ ...options, method: METHOD.GET },
			options.timeout
		);
	};

	put = (url: string, options: OptionsType = {}) => this.request(url, {
		...options, method: METHOD.PUT
	}, options.timeout);

	post = (url: string, options: OptionsType = {}) => this.request(
		url,
		{ ...options, method: METHOD.POST },
		options.timeout
	);

	delete = (url: string, options: OptionsType = {}) => this.request(url, {
		...options, method: METHOD.DELETE
	}, options.timeout);

	// eslint-disable-next-line class-methods-use-this
	request = (url: string, options: OptionsType, timeout = 5000) => {
		const {
			headers,
			data,
			method = METHOD.GET
		} = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url);

			xhr.timeout = timeout;

			if (headers) {
				Object.keys(headers).forEach((name) => {
					const value = headers[name];
					xhr.setRequestHeader(name, value);
				});
			}

			xhr.onload = function () {
				resolve(xhr);
			};

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = reject;

			if (method === METHOD.GET || !data) xhr.send();
			else xhr.send(data as any);

		});

	};
}

export default HTTPTransport;
