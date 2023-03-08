import tmp from 'bundle-text:./index.hbs';
import { link } from './components/link/index';
import * as styles from './style.module.scss';
import arrowImg from '../../public/arrow.png';
import { Block } from '../../packages';
import { Form } from './components';
import { Loader } from '../../ui';
import { AuthController } from '../../controllers';

type PropsType = {
	href: string,
	link: Block,
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
			...args
		});
	}

	override componentDidMount() {
		AuthController.getProfile();
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default () => new ProfilePage({
	href: '/',
	form: new Form({}),
	loader: new Loader({}),
	link: link({ href: '/', iconPath: arrowImg })
});
