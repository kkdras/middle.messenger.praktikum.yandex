import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { classNames } from '../../utils';
import { Block } from '../../packages';

export type ButtonPropsType = {
	children: string,
	classes?: string[] | string,
	viewType?: 'outline',
	type?: HTMLButtonElement['type'],
	events?: Record<string, (...args: any[])=> void>
}

class Button extends Block {
	constructor({
		type = 'button',
		viewType,
		events = {},
		...args
	}: ButtonPropsType) {
		super('div', {
			class: {
				button: classNames(
					style.button,
					{ [style.button_outlined]: viewType === 'outline' },
					args.classes || []
				)
			},
			events: {
				...events,
				listenOnChildOfTreePosition: 1
			},
			type,
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default Button;
