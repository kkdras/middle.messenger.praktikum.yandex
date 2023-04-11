export function isEqual(a: object, b: object): boolean {
	const aEntries = Object.keys(a);
	const bEntries = Object.keys(b);
	if (aEntries.length !== bEntries.length) return false;

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
