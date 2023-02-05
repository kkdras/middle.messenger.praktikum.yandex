declare module '*.module.scss' {
	const content: { readonly [className: string]: string };
	export = content;
}

declare module '*.scss' {
	const classes: { readonly [key: string]: string }
	export default classes
}

// namespace Handlebars {
// 	compile: 
// }

declare module 'bundle-text:./*' {
	export default string
}

declare module '*.jpg' {
	const value: string;
	export default value;
}
declare module '*.png' {
	const value: string;
	export default value;
}
