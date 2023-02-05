import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { classNames, defineMixin, ValidationMixin } from '../../utils';
import { Block } from '../../packages';

export type TextFieldProps = {
	type?: HTMLInputElement['type'],
	error?: boolean,
	label: string,
	id: string,
	pattern?: string,
	maxLength?: number,
	minLength?: number,
	required?: boolean,
	placeholder?: string,
}

interface TextField extends Block, ValidationMixin {}

class TextField extends Block {
	constructor({
		error = false,
		type = 'text',
		pattern = '.*',
		maxLength = 255,
		minLength = 0,
		required = true,
		placeholder = '',
		...args
	}: TextFieldProps) {
		super('div', {
			class: {
				field: classNames(
					style.field,
					{ [style.field_error]: error }
				),
				fieldLabel: style.field__label,
				fieldInput: style.field__input
			},
			type,
			pattern,
			maxLength,
			minLength,
			required,
			placeholder,
			...args
		});
	}

	render() {
		return Block.compile(tmp, this.props);
	}
}

defineMixin(TextField, [ValidationMixin]);

export default TextField;
