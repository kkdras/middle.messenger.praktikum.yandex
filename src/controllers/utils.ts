/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { errorHandler, Store } from '../store';

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
	const valid = data instanceof FormData && data.has('avatar') && !!data.get('avatar');

	if (!valid) throw new Error('avatar is incorrect');
};

export function isDataResponseObject(data: unknown): data is IResponse<unknown> {
	return !!data && typeof data === 'object' && 'json' in data && 'status' in data;
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
	settledPromise: PromiseSettledResult<T>
): asserts settledPromise is PromiseFulfilledResult<T> {
	if (settledPromise.status === 'rejected') {
		const reason = settledPromise.reason as unknown;
		if (reason && typeof reason === 'object' && reason instanceof Error) {
			throw reason;
		}

		throw reason;
	}
}

export const WithLoader = (
	_target: object,
	_propertyKey: string,
	descriptor: TypedPropertyDescriptor<(...args: any[])=> any>
): TypedPropertyDescriptor<(...args: any[])=> any> => {
	const oldValue = descriptor.value;

	descriptor.value = function (...args) {
		addLoader();
		const promise = oldValue!.apply(this, args)
			.finally(() => removeLoader());

		return promise;
	};

	return descriptor;
};

export function checkIsMessageType(
	maybeMessage: unknown
): maybeMessage is IMessage | IMessage[] {
	const isRightMessageArr: boolean = Array.isArray(maybeMessage)
		&& !!maybeMessage.length
		&& maybeMessage.every((message) => message.type === 'message');

	const isRightMessage: boolean = (maybeMessage as IMessage).type === 'message';

	return isRightMessage || isRightMessageArr;
}

type CommonFunctionDescriptor = TypedPropertyDescriptor<(...args: any[])=> any>

export const AsyncCatch = (
	{ nextThrow }: { nextThrow: boolean } = { nextThrow: false }
) => {
	return (
		_target: object,
		_propertyKey: string,
		descriptor: CommonFunctionDescriptor
	): CommonFunctionDescriptor => {
		const oldValue = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			try {
				const res = await oldValue!.apply(this, args);
				return res;
			} catch(e) {
				errorHandler(e as Error);
				if (nextThrow) throw e;
			}
		};

		return descriptor;
	};
};

export const SyncCatch = (
	{ nextThrow }: { nextThrow: boolean } = { nextThrow: false }
) => {
	return (
		_target: object,
		_propertyKey: string,
		descriptor: CommonFunctionDescriptor
	) => {
		const oldValue = descriptor.value;

		descriptor.value = function (...args: any[]) {
			try {
				const res = oldValue!.apply(this, args);
				return res;
			} catch(e) {
				errorHandler(e as Error);
				if (nextThrow) throw e;
			}
		};

		return descriptor;
	};
};
