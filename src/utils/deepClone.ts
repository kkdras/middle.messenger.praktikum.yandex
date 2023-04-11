type ArrTarget = unknown[];

type ObjectTarget = { [key: string]: unknown }

type TargetType = ArrTarget | ObjectTarget;

export const deepClone = <T extends unknown>(
	target: T,
	limitation?: (arg: ObjectTarget | ArrTarget)=> boolean
): T => {
	function isObjectOrArray(item: unknown): item is TargetType {
		return (typeof item === 'object' || Array.isArray(item)) && !!item;
	}

	const handleObject = (obj: ObjectTarget) => Object.entries(obj)
		.reduce((acc, [key, value]) => {
			acc[key] = isObjectOrArray(value)
				&& (!limitation || Array.isArray(value) || limitation(value))
				? deepClone(value, limitation)
				: value;
			return acc;
		}, {} as ObjectTarget);

	const handleArray = (arr: ArrTarget) => arr.map((item) => {
		return isObjectOrArray(item) && (!limitation || limitation(item))
			? deepClone(item, limitation)
			: item;
	});

	let clone = target;

	if (isObjectOrArray(target)) {
		clone = (Array.isArray(target) ? handleArray(target) : handleObject(target)) as T;
	}

	return clone;
};
