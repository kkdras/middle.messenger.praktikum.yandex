import tmp from './index.hbs';
import style from './style.module.scss';
import { BaseInputHandlers, classNames } from '../../utils';
import BaseInput from '../baseInput';
import { BlockEvents, Block } from '../../packages/Block';

export type TextFieldProps = {
	type?: HTMLInputElement['type'];
	error?: boolean;
	label: string;
	id: string;
	pattern?: string;
	maxLength?: number;
	minLength?: number;
	required?: boolean;
	placeholder?: string;
	errorMessage?: string;
	defaultValue?: string;
	events?: BlockEvents;
};

class TextField extends Block {
	input: Block;
	constructor({
		error,
		id,
		maxLength,
		minLength,
		pattern,
		placeholder,
		required,
		type,
		errorMessage = '',
		defaultValue = '',
		events = {},
		...args
	}: TextFieldProps) {
		const input = new BaseInput({
			id,
			events: { ...new BaseInputHandlers(), ...events },
			classes: style.field__input,
			maxLength,
			minLength,
			pattern,
			placeholder,
			required,
			type,
			defaultValue
		});

		super('div', {
			class: {
				field: classNames(style.field, { [style.field_error]: error }),
				fieldLabel: style.field__label,
				errorContainer: style.field__errorContainer,
				errorBody: style.field__errorBody
			},
			children: input,
			errorMessage,
			...args
		});
		this.input = input;
	}

	override componentDidMount(): void {
		this.input._eventBus().on('invalid', () => {
			const container = this.getContent()?.firstElementChild;
			if (!container) return;
			container.classList.add('invalid');
		});

		this.input._eventBus().on('valid', () => {
			const container = this.getContent()?.firstElementChild;
			if (!container) return;
			container.classList.remove('invalid');
		});
	}

	render() {
		return Block.compile(tmp, this.props);
	}
}

export default TextField;
