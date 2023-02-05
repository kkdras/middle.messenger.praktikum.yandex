import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { classNames } from '../../utils';
import { Block } from '../../packages';

export type ButtonPropsType = {
	children: string,
	classes?: string[] | string,
	viewType?: 'outline',
	type?: HTMLButtonElement['type'],
}

class Button extends Block {
	constructor({
		type = 'button',
		viewType,
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
			type,
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default Button;
