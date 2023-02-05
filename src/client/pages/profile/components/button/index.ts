import Handlebars from 'handlebars';
import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { classNames } from '../../../../utils';
import { Block } from '../../../../packages';

export default ({
	text = '',
	type = '',
	classes = [],
	...props
}) => Handlebars.compile(tmp)({
	class: {
		btn: classNames(style.btn, classes),
		btnItem: classNames(
			style.btn__item,
			{ [style.btn__item_warning]: type === 'warning' }
		)
	},
	text,
	...props
});

export type ButtonPropsType = {
	children: string | Block,
	type?: HTMLButtonElement['type'],
	classes?: string[],
}

export class Button extends Block {
	constructor({
		classes = [],
		type = 'button',
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
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
