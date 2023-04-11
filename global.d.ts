declare module '*.module.scss' {
	const content: { readonly [className: string]: string };
	export = content;
}

declare module '*.scss' {
	const classes: { readonly [key: string]: string };
	export default classes;
}

interface env {
	[index: string]: string;
}

declare const process = {
	env: {
		NODE_ENV: string,
		BASE_PATH: string,
		RESOURCES_PATH: string
	} as env
};

declare module 'bundle-text:./*' {
	export default string;
}
declare module '*.hbs' {
	export default string;
}

declare module '*.jpg' {
	const value: string;
	export default value;
}
declare module '*.png' {
	const value: string;
	export default value;
}
declare module '*.gif' {
	const value: string;
	export default value;
}
