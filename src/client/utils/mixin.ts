const defineMixin = <
	T extends new ()=> any,
	S extends (new (...args: any[])=> unknown)[]
>(BaseClass: T, mixins: S) => {
	mixins.forEach((item) => {
		const mixin = item.prototype;
		Object.getOwnPropertyNames(mixin).forEach((methodName) => {
			if (methodName === 'constructor') return;
			Object.defineProperty(
				BaseClass.prototype,
				methodName,
				Object.getOwnPropertyDescriptor(mixin, methodName) || Object.create(null)
			);
		});
	});

	return BaseClass as any as T extends new (...args: infer A)=> infer O
		? S[number] extends new (...args: any[])=> infer G
			? new (...args: A)=> O & G
			: never
		: never;
};

export default defineMixin;
