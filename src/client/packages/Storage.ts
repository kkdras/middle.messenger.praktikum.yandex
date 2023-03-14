// eslint-disable-next-line arrow-body-style
export const getItem = (key: string) => {
	return localStorage.getItem(key) as unknown;
};

export const setItem = (key: string, value: string) => {
	localStorage.setItem(key, value);
};

export const removeItem = (key: string) => {
	localStorage.removeItem(key);
};
