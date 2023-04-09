export const set = <T extends Record<string, unknown>>(
	object: T,
	path: string,
	newValue: unknown
): T => {
	if (
		typeof object !== 'object'
		|| typeof object === 'function'
		|| !object
	) return object;

	if (typeof path !== 'string' || path === '') {
		throw new Error('invalid path param');
	}

	let target: T = object;
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
	return object;
};
