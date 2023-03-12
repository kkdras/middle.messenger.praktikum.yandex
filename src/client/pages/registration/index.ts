import tmp from 'bundle-text:./index.hbs';
import { AuthController } from '../../controllers/auth';
import {
	Card, Container, TextField, Button
} from '../../ui';
import * as style from './style.module.scss';
import { Block, getItem, Router } from '../../packages';
import { buttons, fields } from './utils';

type PropsType = {
	children: Block[]
}

export function handleSubmit(e: Event) {
	e.preventDefault();
	const form = (e.target as HTMLFormElement);
	const isValid = form.checkValidity();
	if (isValid) {
		const data = Object.fromEntries(
			new FormData(e.target as HTMLFormElement)
		);

		AuthController.signUp(data as SignUp.body);
		form.reset();
	}
}

const router = new Router();
class RegistrationPage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				form: style.form,
				formTitle: style.form__title
			},
			...args,
			events: {
				submit: handleSubmit
			}
		});
	}

	componentDidMount() {
		const isActiveSession = !!Number(getItem('session'));

		if (isActiveSession) router.go('/profile');
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const Page = new RegistrationPage({
	children: [
		...fields.map((item) => new TextField(item)),
		...buttons.map((item) => new Button(item))
	]
});

export default () => new Container({
	children: new Card({ children: Page })
});
