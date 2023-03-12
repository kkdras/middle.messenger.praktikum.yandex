// to do - realize infer types use mapped types

import { Block } from '../packages';

// eslint-disable-next-line import/prefer-default-export
export const set = <T extends Record<string, unknown>>(
	store: T,
	path: string,
	newValue: unknown
): T => {
	if (
		typeof store !== 'object'
		|| typeof !store === 'function'
	) return store;

	let target: T = store;
	const names = path.split('.');
	const [nestedNames, aimPropertyName] = [
		names.slice(0, names.length - 1),
		names[names.length - 1]
	];

	nestedNames.forEach((propertyName) => {
		if (propertyName in target) target = target[propertyName] as T;
		else target = (target[propertyName as keyof T] = {} as T[keyof T]) as T;
	});

	target[aimPropertyName as keyof T] = newValue as T[keyof T];
	return store;
};

export function isEqual(a: object, b: object): boolean {
	const aEntries = Object.keys(a);
	const bEntries = Object.keys(b);
	if (aEntries.length !== bEntries.length) return false;

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < aEntries.length; i++) {
		const key = aEntries[i];
		const elA = a[key as keyof typeof a];
		const elB = b[key as keyof typeof b];

		if (typeof elA === 'object' && typeof elB === 'object' && elA && elB) {
			if (!isEqual(elA, elB)) return false;
		} else if (elA !== elB || key in a !== key in b) return false;
	}
	return true;
}

type ArrTarget = unknown[];

type ObjectTarget = { [key: string]: unknown }

type TargetType = ArrTarget | ObjectTarget;

export const deepClone = <T extends TargetType>(
	target: T,
	limitation?: (arg: ObjectTarget)=> boolean
): T => {
	function isObjectOrArray(item: unknown): item is TargetType {
		return (typeof item === 'object' || Array.isArray(item)) && !!item;
	}

	const handleObject = () => Object.entries(target)
		.reduce((acc, [key, value]) => {
			acc[key] = isObjectOrArray(value)
				&& (!limitation || (!Array.isArray(value) && limitation(value)))
				? deepClone(value, limitation)
				: value;
			return acc;
		}, {} as ObjectTarget) as T;

	const handleArray =	(arr: unknown[]) => arr
		.map((item) => (isObjectOrArray(item) ? deepClone(item, limitation) : item)) as T;

	return Array.isArray(target) ? handleArray(target) : handleObject();
};

export const debounceInvokeFunction = (callback: ()=> void, delay = 0) => {
	const timeout = setTimeout(() => {
		callback();
	}, delay);

	return timeout;
};

export const limitDeepCopy = (value: unknown): boolean => !(!!value
	&& typeof value === 'object'
	&& value instanceof Block);

export const noop = () => 0;

export const logger = (...logs: unknown[]) => {
	if (process.env.NODE_ENV === 'production') return;
	if (logs.length === 1 && typeof logs[0] === 'object' && logs[0] instanceof Error) {
		console.error(logs[0]);
	} else {
		console.log(...logs);
	};
};
