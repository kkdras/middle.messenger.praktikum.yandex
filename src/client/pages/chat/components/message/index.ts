import tmp from 'bundle-text:./index.hbs';
import { Block } from '../../../../packages';
import { classNames } from '../../../../utils';
import * as styles from './style.module.scss';

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
