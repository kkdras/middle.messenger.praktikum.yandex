/**
 * 
 * @param  {...(string | { string: any } | any[])} args
 * @returns 
 */
type ObjectType = Record<string, unknown>

type ArrayType = (string | ObjectType | number | ArrayType)[]

const classNames = (...args: ArrayType) => {
	const calcObj = (obj: ObjectType): string => Object
		.entries(obj)
		.filter((entry) => !!entry[1])
		.map((entry) => entry[0].trim())
		.join(' ');

	const calcArr = (arr: ArrayType): string => arr
		.filter((item) => !!item)
		.map((item) => {
			if (typeof item !== 'object') return String(item).trim();
			if (typeof item === 'object' && !Array.isArray(item)) return calcObj(item);
			if (Array.isArray(item)) return calcArr(item);
			throw new Error('wrong type of args');
		}).join(' ');

	return calcArr(args).trim();
};

export default classNames;
