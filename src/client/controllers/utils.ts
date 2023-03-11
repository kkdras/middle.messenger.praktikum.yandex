import { Store } from '../store';

export const checkValidSignUpData = (data: object) => {
	const valid = (
		'first_name' in data
		&& 'second_name' in data
		&& 'email' in data
		&& 'phone' in data
		&& 'password' in data
		&& 'login' in data
	);

	if (!valid) throw new Error('profile data is incorrect');
};

export const checkValidNewProfile = (data: object) => {
	const valid = (
		'first_name' in data
		&& 'second_name' in data
		&& 'email' in data
		&& 'phone' in data
		&& 'login' in data
		&& 'display_name' in data
	);

	if (!valid) throw new Error('profile data is incorrect');
};

export const checkValidNewPassword = (data: object) => {
	const valid = (
		'newPassword' in data
		&& 'oldPassword' in data
	);

	if (!valid) throw new Error('password is incorrect');
};

export const checkValidAvatar = (data: unknown) => {
	const valid = data instanceof FormData && data.has('avatar');

	if (!valid) throw new Error('avatar is incorrect');
};

export const checkValidSignInData = (data: object) => {
	const valid = (
		'password' in data
		&& 'login' in data
	);

	if (!valid) throw new Error('auth data is incorrect');
};

export const addLoader = () => {
	Store.setState('app.loader', Store.getState().app.loader + 1);
};

export const removeLoader = () => {
	Store.setState('app.loader', Store.getState().app.loader - 1);
};

export const throwError = (message: string): never => {
	throw new Error(message);
};

export function assertsAllSettledPromise<T>(
	promise: PromiseSettledResult<T>,
	altMessage: string
): asserts promise is PromiseFulfilledResult<T> {
	if (promise.status === 'rejected') {
		const reason = promise.reason as unknown;
		if (reason && typeof reason === 'object' && reason instanceof Error) {
			throw reason;
		}

		throwError(typeof reason === 'string' ? reason : altMessage);
	}
}
