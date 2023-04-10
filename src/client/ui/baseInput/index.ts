import tmp from './index.hbs';
import { BlockEvents, Block } from '../../packages/Block';

export type DefaultInputProps = {
	type?: HTMLInputElement['type'],
	id: string,
	pattern?: string,
	maxLength?: number,
	minLength?: number,
	required?: boolean,
	placeholder?: string,
	classes?: string,
	events: BlockEvents,
	defaultValue: string
}

class DefaultInput extends Block {
	constructor({
		type = 'text',
		pattern = '.*',
		maxLength = 255,
		minLength = 0,
		required = true,
		placeholder = '',
		classes = '',
		events = {},
		...args
	}: DefaultInputProps) {
		super('div', {
			class: classes,
			type,
			pattern,
			maxLength,
			minLength,
			required,
			placeholder,
			events: {
				listenOnChildOfTreePosition: 1,
				...events
			},
			...args
		});
	}

	render() {
		return Block.compile(tmp, this.props);
	}
}

export default DefaultInput;
