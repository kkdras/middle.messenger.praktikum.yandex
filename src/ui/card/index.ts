import tmp from './index.hbs';
import style from './style.module.scss';
import { classNames } from '../../utils';
import { Block } from '../../packages/Block';

type PropsType = {
	children: Block | Block[];
	blackout?: boolean;
};

class Card extends Block {
	constructor(props: PropsType) {
		super('div', {
			class: {
				card: classNames(
					style.card,
					{ [style.blackout]: !!props.blackout }
				),
				cardWrapper: style.card__wrapper,
				cardBody: style.card__body
			},
			...props
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default Card;
