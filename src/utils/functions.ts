export const debounceInvokeFunction = (callback: ()=> void, delay = 0) => {
	const timeout = setTimeout(() => {
		callback();
	}, delay);

	return timeout;
};

export const noop = () => 0;

export const logger = (...logs: unknown[]) => {
	if (process.env.NODE_ENV === 'production') return;
	if (logs.length === 1 && typeof logs[0] === 'object' && logs[0] instanceof Error) {
		console.error(logs[0]);
	} else {
		console.log(...logs);
	};
};

export const dropLast = <T extends unknown>(count: number, arr: T[]): T[] => {
	return arr.slice(0, arr.length - count);
};
