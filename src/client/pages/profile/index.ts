import tmp from 'bundle-text:./index.hbs';
import * as styles from './style.module.scss';
import arrowImg from '../../public/arrow.png';
import avatarImg from '../../public/avatar.jpg';
import {
	handleSubmit
} from '../../utils/validation';
import { Block } from '../../packages';
import { Form } from './components';

type PropsType = {
	href: string,
	leftBarImg: string,
	children: Block
}

class ProfilePage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				pageContainer: styles.pageContainer,
				leftBar: styles.leftBar,
				profile: styles.profile
			},
			events: handleSubmit,
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const page = new ProfilePage({
	href: '/',
	leftBarImg: arrowImg,
	children: new Form({
		avatarImg,
		name: 'Константин'
	})
});

export default page;
