type baseMethod = (...args: any[])=> Promise<unknown>;

interface baseAPI {
	create?: baseMethod;
	request?: baseMethod;
	delete?: baseMethod;
	update?: baseMethod;
}

export default baseAPI;
