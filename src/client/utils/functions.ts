// to do - realize infer types use mapped types
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

		if (typeof elA === 'object' && typeof elB === 'object') {
			if (!isEqual(elA, elB)) return false;
		} else if (elA !== elB || key in a !== key in b) return false;
	}
	return true;
}
