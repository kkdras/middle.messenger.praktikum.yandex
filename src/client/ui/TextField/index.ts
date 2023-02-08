import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import {
	BaseInputHandlers, classNames
} from '../../utils';
import { Block } from '../../packages';
import BaseInput from '../baseInput';

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
	errorMessage: string
}

class TextField extends Block {
	constructor({
		error,
		id,
		maxLength,
		minLength,
		pattern,
		placeholder,
		required,
		type,
		...args
	}: TextFieldProps) {
		super('div', {
			class: {
				field: classNames(
					style.field,
					{ [style.field_error]: error }
				),
				fieldLabel: style.field__label,
				errorContainer: style.field__errorContainer,
				errorBody: style.field__errorBody
			},
			children: new BaseInput({
				id,
				events: BaseInputHandlers,
				classes: style.field__input,
				maxLength,
				minLength,
				pattern,
				placeholder,
				required,
				type
			}),
			...args
		});
	}

	componentDidMount(): void {
		const target = this._children['children' as keyof typeof this._children];
		const container = this.getContent()?.firstElementChild;

		target._eventBus().on('invalid', () => {
			if (!container) return;
			container.classList.add('invalid');
		});

		target._eventBus().on('valid', () => {
			if (!container) return;
			container.classList.remove('invalid');
		});
	}

	render() {
		return Block.compile(tmp, this.props);
	}
}

export default TextField;
