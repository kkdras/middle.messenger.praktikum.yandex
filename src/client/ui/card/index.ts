import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../packages';

type PropsType = {
	children: Block | Block[]
}

class Card extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				card: style.card,
				cardWrapper: style.card__wrapper,
				cardBody: style.card__body
			},
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default Card;
