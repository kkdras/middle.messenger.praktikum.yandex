import tmp from './index.hbs';
import { Block } from '../../../../packages/Block';
import { classNames } from '../../../../utils';
import styles from './style.module.scss';

type PropsType = {
	message: string;
	time: string;
	their: boolean;
	name: string;
}

export class Message extends Block {
	constructor(props: PropsType) {
		super('div', {
			class: {
				message: classNames(styles.message, props.their ? styles.their : styles.my),
				messageTime: styles.message__time,
				messageBody: styles.message__body,
				messageOwner: styles.message__owner
			},
			...props
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}
