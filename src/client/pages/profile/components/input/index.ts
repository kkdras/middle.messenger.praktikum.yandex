import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../../../packages';
import { ValidationMixin } from '../../../../utils/validation';
import { defineMixin, classNames } from '../../../../utils';

export default ({
	type = 'text',
	labelText = '',
	id = '',
	classes = [],
	value = 'some text',
	...props
}) => Handlebars.compile(tmp)({
	class: {
		input: classNames(style.input, classes)
	},
	id,
	labelText,
	type,
	value,
	...props
});

export type InputPropsType = {
	pattern?: string,
	id: string,
	classes?: string[],
	label: string,
	type?: HTMLInputElement['type'],
	value?: string,
	minLength?: number,
	maxLength?: number,
	required?: boolean,
}

export interface InputClass extends Block, ValidationMixin {};

export class InputClass extends Block {
	constructor({
		classes = [],
		type = 'text',
		value = '',
		pattern = '.*',
		required = true,
		minLength = 0,
		maxLength = 255,
		...args
	}: InputPropsType) {
		super('div', {
			class: {
				input: classNames(style.input, classes)
			},
			type,
			value,
			pattern,
			required,
			minLength,
			maxLength,
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

defineMixin(InputClass, [ValidationMixin]);
