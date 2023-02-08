import tmp from 'bundle-text:./index.hbs';
import * as styles from './style.module.scss';
import { Block } from '../../../../packages';
import { BaseInputHandlers, classNames } from '../../../../utils';
import { BaseInput } from '../../../../ui';

export type InputPropsType = {
	pattern?: string,
	id: string,
	classes?: string[],
	label: string,
	type?: HTMLInputElement['type'],
	placeholder?: string,
	minLength?: number,
	maxLength?: number,
	required?: boolean,
	errorMessage: string
}

export class InputClass extends Block {
	constructor({
		classes = [],
		type = 'text',
		placeholder = '',
		pattern = '.*',
		required = true,
		minLength = 0,
		maxLength = 255,
		id,
		...args
	}: InputPropsType) {
		super('div', {
			class: {
				inputContainer: classNames(styles.inputContainer, classes),
				inputBody: styles.inputContainer__body,
				errorContainer: styles.inputContainer__errorContainer,
				errorBody: styles.inputContainer__errorBody
			},
			children: new BaseInput({
				classes: styles.inputContainer__input,
				events: BaseInputHandlers,
				maxLength,
				id,
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

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
