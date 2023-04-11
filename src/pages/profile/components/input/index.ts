import tmp from './index.hbs';
import styles from './style.module.scss';
import { BaseInputHandlers, classNames } from '../../../../utils';
import { BaseInput } from '../../../../ui';
import { Block } from '../../../../packages/Block';

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
	errorMessage: string,
	defaultValue: string,
}
export class InputClass extends Block {
	input: Block;
	constructor(props: InputPropsType) {
		const {
			classes = [],
			type = 'text',
			placeholder = '',
			pattern = '.*',
			required = true,
			minLength = 0,
			maxLength = 255,
			defaultValue,
			id
		} = props;

		const input = new BaseInput({
			classes: styles.inputContainer__input,
			events: new BaseInputHandlers(),
			maxLength,
			id,
			minLength,
			pattern,
			placeholder,
			required,
			type,
			defaultValue
		});

		super('div', {
			class: {
				inputContainer: classNames(styles.inputContainer, classes),
				inputBody: styles.inputContainer__body,
				errorContainer: styles.inputContainer__errorContainer,
				errorBody: styles.inputContainer__errorBody
			},
			children: input,
			...props
		});
		this.input = input;
	}

	override propsUpdated() {
		const { defaultValue } = this.props;
		this.input.setProps({
			...this.input._meta.props,
			defaultValue
		});
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

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
