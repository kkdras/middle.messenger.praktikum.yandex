import tmp from './index.hbs';
import style from './style.module.scss';
import { classNames } from '../../../../utils';
import { Block, BlockEvents } from '../../../../packages/Block';

export type ButtonPropsType = {
	children: string | Block,
	type?: HTMLButtonElement['type'],
	classes?: string[],
	events?: BlockEvents
}

export class Button extends Block {
	constructor({
		classes = [],
		type = 'button',
		events = {},
		...args
	}: ButtonPropsType) {
		super('div', {
			class: {
				btn: classNames(style.btn, classes),
				btnItem: classNames(
					style.btn__item,
					{ [style.btn__item_warning]: type === 'warning' }
				)
			},
			classes,
			type,
			events: {
				...events,
				listenOnChildOfTreePosition: 1
			},
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
