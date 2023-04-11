import tmp from './index.hbs';
import { Block } from '../../../../packages/Block';
import { createLink } from '../../../../packages/Router';
import style from './style.module.scss';

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

export default createLink(Link, 2);
