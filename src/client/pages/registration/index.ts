import tmp from 'bundle-text:./index.hbs';
import { AuthController } from '../../controllers/auth';
import {
	Card, Container, TextField, Button
} from '../../ui';
import * as style from './style.module.scss';
import { buttons, fields } from './utils';
import { Store, withPasswordError } from '../../store';
import { Block } from '../../packages/Block';
import { Router } from '../../packages/Router';
import { getItem } from '../../packages/Storage';

type PropsType = {
	fields: Block[];
	buttons: Block[];
	passwordError: boolean;
};

export function handleSubmit(this: Block, e: Event) {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const isValid = form.checkValidity();

	if (isValid) {
		const data = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		) as SignUp.body & { passwordExamination: string };

		if (data.password !== data.passwordExamination) {
			Store.setState('app.passwordError', true);
			return;
		}

		AuthController.signUp({
			...data,
			phone: data.phone.replace('+', '')
		});
		form.reset();
	}
}

const router = new Router();
class _RegistrationPage extends Block {
	constructor(props: PropsType) {
		super('div', {
			class: {
				form: style.form,
				formTitle: style.form__title,
				passwordError: !props.passwordError ? style.hidden : style.passwordError
			},
			events: {
				submit: handleSubmit
			},
			...props
		});
	}

	override componentDidMount() {
		if (getItem('session')) router.go('/profile', true);
	}

	override storePropsUpdated() {
		const newProps = this._meta.props as {
			class: Record<string, string>;
		} & PropsType;
		this.setProps({
			...newProps,
			class: {
				...newProps.class,
				passwordError: !newProps.passwordError
					? style.hidden
					: style.passwordError
			}
		});
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const RegistrationPage = withPasswordError(_RegistrationPage);

const Page = new RegistrationPage({
	fields: fields.map((item) => new TextField(item)),
	buttons: buttons.map((item) => new Button(item))
});

export default () =>
	new Container({
		children: new Card({ children: Page })
	});
