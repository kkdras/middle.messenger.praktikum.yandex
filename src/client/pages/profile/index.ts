import tmp from 'bundle-text:./index.hbs';
import * as styles from './style.module.scss';
import arrowImg from '../../public/arrow.png';
import avatarImg from '../../public/avatar.jpg';
// import {
// 	handleSubmit
// } from '../../utils/validation';
import { Block } from '../../packages';
import { Form } from './components';
import { Loader } from '../../ui';

type PropsType = {
	href: string,
	leftBarImg: string,
	form: Block,
	loader: Block,
}

class ProfilePage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				pageContainer: styles.pageContainer,
				leftBar: styles.leftBar,
				profile: styles.profile
			},
			events: {},
			...args
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default () => new ProfilePage({
	href: '/',
	leftBarImg: arrowImg,
	form: new Form({
		avatarImg,
		name: 'Константин'
	}),
	loader: new Loader({})
});
