import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../../../packages';

export type LinkPropsType = {
	href?: string,
	label?: string,
}

class Link extends Block {
	constructor({
		href = '',
		label = '',
		...args
	}: LinkPropsType) {
		super('div', {
			class: {
				link: style.link
			},
			href,
			label,
			...args
		});
	}
	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default Link;
