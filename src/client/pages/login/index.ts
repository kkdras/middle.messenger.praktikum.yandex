import tmp from 'bundle-text:./index.hbs';
import * as style from './style.module.scss';
import { Block } from '../../packages';
import { handleSubmit, LOGIN_PATTERN, PASSWORD_PATTERN } from '../../utils/validation';
import {
	Button, ButtonPropsType, Card, Container, TextField, TextFieldProps
} from '../../ui';

const fields: TextFieldProps[] = [
	{
		id: 'login', label: 'Логин', type: 'text', pattern: LOGIN_PATTERN, minLength: 3, maxLength: 20
	},
	{
		id: 'password', label: 'Пароль', type: 'password', pattern: PASSWORD_PATTERN, minLength: 8, maxLength: 40
	}
];

const buttons: ButtonPropsType[] = [
	{ children: 'Авторизоваться', classes: style.form__logInButton },
	{ children: 'Нет аккаунта?', type: 'outline' }
];

type PropsType = {
	children: string | Block | Block[]
}

class LoginPage extends Block {
	constructor(args: PropsType) {
		super('div', {
			class: {
				form: style.form,
				formTitle: style.form__title
			},
			...args
		});
	}

	componentDidMount(): void {
		const form = this.getContent()?.querySelector('form');
		if (!form) console.error('form not found');
		form?.addEventListener('submit', handleSubmit.bind(this));
	}

	render(): DocumentFragment {
		return Block.compile(tmp, this.props);
	}
}

const CurrentPage = new LoginPage({
	children: [
		...fields.map((item) => new TextField(item)),
		...buttons.map((item) => new Button(item))
	]
});

export default new Container({
	children: new Card({
		children: CurrentPage
	})
});
