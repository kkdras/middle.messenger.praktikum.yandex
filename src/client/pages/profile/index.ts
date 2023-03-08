import tmp from 'bundle-text:./index.hbs';
import * as styles from './style.module.scss';
import arrowImg from '../../public/arrow.png';
import {
	handleSubmit
} from '../../utils/validation';
import { Block } from '../../packages';
import { Form } from './components';
import { Loader } from '../../ui';
import { AuthController } from '../../controllers';

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
			events: {
				submit: handleSubmit
			},
			...args
		});
	}

	override componentDidMount() {
		AuthController.LoadProfile();
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

export default () => new ProfilePage({
	href: '/',
	leftBarImg: arrowImg,
	form: new Form({}),
	loader: new Loader({})
});
