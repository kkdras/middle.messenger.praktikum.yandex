import tmp from 'bundle-text:./index.hbs';
import { withPasswordMode } from '../../store';
import { link } from './components/link/index';
import * as styles from './style.module.scss';
import arrowImg from '../../public/arrow.png';
import { Block } from '../../packages';
import { Form, PasswordForm } from './components';
import { Loader } from '../../ui';
import { AuthController } from '../../controllers';

type PropsType = {
	href: string,
	link: Block,
	form: Block,
	loader: Block,
	passwordMode: boolean
}

class ProfilePage extends Block {
	profileForm: Block | null;
	passwordFrom: Block | null;
	constructor(args: Omit<PropsType, 'form'>) {
		const profileForm = new Form({});
		const passwordForm = new PasswordForm({});

		super('div', {
			class: {
				pageContainer: styles.pageContainer,
				leftBar: styles.leftBar,
				profile: styles.profile
			},
			form: profileForm,
			...args
		} as PropsType);

		this.profileForm = profileForm;
		this.passwordFrom = passwordForm;
	}

	override componentDidMount() {
		AuthController.getProfile();
	}

	override propsUpdated() {
		const passwordMode = (this.props as PropsType).passwordMode;
		const currentForm = (this.props as PropsType).form;
		const prevProps = this._meta.props as PropsType;

		if (passwordMode === true && currentForm instanceof Form) {
			this.passwordFrom?.dispatchComponentDidMount();
			this.setProps({
				...prevProps,
				form: this.passwordFrom
			} as PropsType);
		} else if (passwordMode === false && currentForm instanceof PasswordForm) {
			this.setProps({
				...prevProps,
				form: this.profileForm
			} as PropsType);
		}
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const ConnectedProfilePage = withPasswordMode(ProfilePage);

export default () => new ConnectedProfilePage({
	href: '/',
	loader: new Loader({}),
	link: link({ href: '/', iconPath: arrowImg })
});
